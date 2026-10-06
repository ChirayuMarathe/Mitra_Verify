"""
MitraVerify - Hindi Spam & Phishing Email Detection using NLP Fundamentals
=============================================================================
This module implements text & email classification from first-principles NLP:
  1. Text & Email Preprocessing (Normalization, Header Parsing, URL/Phone/Email cleaning)
  2. Multi-Script Tokenization (Preserving Devanagari Matras/Conjuncts + Case-Folded Latin)
  3. Stopword Filtering (Stripping grammatical glue without losing urgency cues)
  4. N-Gram Extraction (Capturing phrase context: unigrams, bigrams, trigrams)
  5. Feature Vectorization (TF-IDF over word and n-gram sequences)
  6. Probabilistic Classification (Multinomial Naive Bayes)
  7. Specialized Email Phishing Heuristics:
     - Subject Line Priority Weighting (High-intent emotional lures & threats)
     - Sender Domain Spoofing & Free-Webmail Impersonation Analysis
     - Malicious Attachment Detection (.apk, .exe, .zip, .html, .xlsm, Devanagari एपीके/ज़िप)
     - Urgency & Credential Harvesting Detection (24 hours, OTP, NetBanking, PAN)
  8. Professional English Diagnostic Reporting with transparent NLP token breakdown
"""

import re
import math
import logging
from collections import Counter
from typing import Dict, List, Any, Tuple, Optional
from urllib.parse import urlparse

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

logger = logging.getLogger(__name__)

# Devanagari character range: \u0900 - \u097F
DEVANAGARI_CHAR_PATTERN = re.compile(r'[\u0900-\u097F]')

# Common Hindi stopwords (grammatical glue words that do not carry semantic fraud signals)
HINDI_STOPWORDS = {
    'है', 'हैं', 'हो', 'था', 'थी', 'थे', 'का', 'के', 'की', 'को', 'में', 'पर',
    'से', 'और', 'या', 'तो', 'भी', 'ने', 'यह', 'वह', 'इस', 'उस', 'इन', 'उन',
    'एक', 'दो', 'जो', 'कर', 'रहा', 'रही', 'रहे', 'गया', 'गई', 'गए', 'दिया',
    'किया', 'सकता', 'सकते', 'सकती', 'हुए', 'हुआ', 'हुई', 'तक', 'लिए', 'साथ',
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for',
    'hai', 'hain', 'ka', 'ke', 'ki', 'ko', 'me', 'mein', 'se', 'aur', 'yeh', 'woh'
}

# Risky email attachments frequently leveraged in Indian phishing campaigns
RISKY_ATTACHMENT_EXTENSIONS = {
    '.apk', '.exe', '.bat', '.scr', '.zip', '.rar', '.7z',
    '.html', '.htm', '.xlsm', '.docm', '.vbs', '.js', '.iso'
}

# Trusted Indian Institutional & Banking Email Domains
OFFICIAL_INSTITUTIONAL_DOMAINS = {
    'sbi.co.in': 'State Bank of India (SBI)',
    'incometax.gov.in': 'Income Tax Department of India',
    'pib.gov.in': 'Press Information Bureau (PIB)',
    'rbi.org.in': 'Reserve Bank of India (RBI)',
    'epfindia.gov.in': 'Employees Provident Fund Organisation (EPFO)',
    'irctc.co.in': 'IRCTC Indian Railways',
    'mygov.in': 'MyGov India',
    'india.gov.in': 'Government of India Portal',
    'hdfcbank.com': 'HDFC Bank',
    'icicibank.com': 'ICICI Bank',
    'axisbank.com': 'Axis Bank',
    'uidai.gov.in': 'UIDAI (Aadhaar)',
    'indiapost.gov.in': 'India Post'
}

# Common free webmail domains (flagged if claiming to be banks or government entities)
FREE_WEBMAIL_DOMAINS = {
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'rediffmail.com', 'yopmail.com', 'mailinator.com', 'proton.me'
}

# Suspicious TLDs commonly leveraged in phishing campaigns
SUSPICIOUS_TLDS = {
    '.xyz', '.top', '.click', '.tk', '.ml', '.ga', '.cf',
    '.gq', '.work', '.loan', '.live', '.buzz', '.fit', '.icu', '.cam'
}


class NLPPreprocessor:
    """
    Fundamental NLP Preprocessing:
    - Normalization: cleans punctuation, URLs, emails, phone numbers
    - Multi-script Tokenization: handles Hindi Devanagari and Latin loanwords
    - Stopword filtering: removes non-informative grammatical noise
    - N-gram generation: extracts unigrams, bigrams, and trigrams
    """

    @staticmethod
    def is_hindi(text: str) -> bool:
        """Determines if the text contains Hindi Devanagari characters or common Hindi words."""
        if not text:
            return False
        clean = text.replace(" ", "")
        if not clean:
            return False
        devanagari_chars = len(DEVANAGARI_CHAR_PATTERN.findall(text))
        ratio = devanagari_chars / len(clean)
        if ratio >= 0.08:
            return True
        # Check for transliterated Hinglish keywords
        hinglish_markers = {
            'karein', 'karo', 'lottery', 'yojana', 'muft', 'turant', 'paise',
            'bhejo', 'khata', 'bijli', 'naukri', 'vetan', 'refund', 'kyc',
            'sampark', 'shulk', 'pan', 'aadhaar', 'inam', 'jeeta'
        }
        words = set(re.findall(r'\b\w+\b', text.lower()))
        return bool(words.intersection(hinglish_markers))

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Step 1: Normalization
        Replaces URLs, emails, phone numbers with special tokens and normalizes punctuation.
        """
        # Replace URLs
        cleaned = re.sub(r'https?://\S+|www\.\S+', ' URL_TOKEN ', text)
        # Replace email addresses
        cleaned = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', ' EMAIL_TOKEN ', cleaned)
        # Replace phone numbers / long digits
        cleaned = re.sub(r'\b\d{10}\b|\+91\s*\d{10}', ' PHONE_TOKEN ', cleaned)
        # Normalize punctuation (Devanagari danda । and latin punctuation)
        cleaned = re.sub(r'[।॥!?,:;\-\"\'\(\)\[\]{}*#_]+', ' ', cleaned)
        # Collapse multiple spaces
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    @staticmethod
    def tokenize(text: str) -> List[str]:
        """
        Step 2: Tokenization
        Splits text into atomic word tokens.
        Preserves Devanagari characters, matras, halant, and folds Latin characters to lowercase.
        """
        cleaned = NLPPreprocessor.clean_text(text)
        tokens = []
        for word in cleaned.split():
            # Lowercase Latin characters while preserving Devanagari unicode
            word_norm = word.lower()
            if word_norm:
                tokens.append(word_norm)
        return tokens

    @staticmethod
    def remove_stopwords(tokens: List[str]) -> List[str]:
        """
        Step 3: Stopword Filtering
        Strips grammatical filler words without losing informative keywords.
        """
        return [tok for tok in tokens if tok not in HINDI_STOPWORDS and len(tok) > 1]

    @staticmethod
    def get_ngrams(tokens: List[str], n: int = 2) -> List[str]:
        """
        Step 4: N-gram generation
        Creates consecutive token tuples to preserve context (e.g. 'tax' + 'refund' = 'tax_refund').
        """
        if len(tokens) < n:
            return []
        return ['_'.join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]


class HindiSpamDetector:
    """
    NLP-Based Hindi Spam & Phishing Email Classifier
    Combines:
      - Feature Vectorizer (TF-IDF over word unigrams and bigrams)
      - Naive Bayes Classifier (P(Spam | Tokens))
      - Email Phishing Heuristics (Subject Line, Sender Domain, Attachments, CTAs)
      - Transparent English Explanations with Cites
    """

    def __init__(self):
        self.preprocessor = NLPPreprocessor()
        self._init_top_spam_lexicon()
        self._build_and_train_model()
        logger.info("HindiSpamDetector initialized with core NLP and email phishing models.")

    def _init_top_spam_lexicon(self):
        """
        Comprehensive Hindi & Hinglish Spam/Phishing Lexicon.
        Tokens carrying extreme mutual information for fraudulent campaigns.
        """
        self.spam_token_weights = {
            # --- Email Phishing & Financial Fraud Tokens ---
            'आयकर_रिफंड': 0.95, 'टैक्स_रिफंड': 0.95, 'tax_refund': 0.95, 'रिफंड_स्वीकृत': 0.95,
            'रिफंड': 0.85, 'refund': 0.85, 'खाता_निलंबित': 0.95, 'खाता_ब्लॉक': 0.95,
            'नेट_बैंकिंग': 0.85, 'netbanking': 0.85, 'पासवर्ड_रीसेट': 0.85, 'password_reset': 0.85,
            'पैन_कार्ड': 0.85, 'pan_card': 0.85, 'फॉर्म_26as': 0.90, 'form_26as': 0.90,
            'केवाईसी': 0.90, 'kyc': 0.90, 'केवाईसी_अपडेट': 0.95, 'kyc_update': 0.95,
            'ओटीपी': 0.85, 'otp': 0.85, 'सीवीवी': 0.90, 'cvv': 0.90,
            'क्रेडिट_कार्ड': 0.80, 'credit_card': 0.80, 'डेबिट_कार्ड': 0.80, 'debit_card': 0.80,
            'अंतिम_चेतावनी': 0.90, 'last_warning': 0.90, 'तत्काल_कार्रवाई': 0.85, 'action_required': 0.85,
            '24_घंटे': 0.90, '24_hours': 0.90, 'खाता_बंद': 0.90, 'account_blocked': 0.95,
            'account_suspended': 0.95, 'सत्यापन_लिंक': 0.85, 'verify_link': 0.85,
            'apk': 0.95, 'एपीके': 0.95, 'apk_फाइल': 0.95, 'डाउनलोड_करें': 0.70,

            # --- Job & Work-From-Home Advance Fee Scams ---
            'जॉब_ऑफर': 0.90, 'job_offer': 0.90, 'ऑफर_लेटर': 0.90, 'offer_letter': 0.90,
            'डाटा_एंट्री': 0.90, 'data_entry': 0.90, 'घर_बैठे': 0.85, 'वर्क_फ्रॉम_होम': 0.90,
            'work_from_home': 0.90, 'पंजीकरण_शुल्क': 0.95, 'registration_fee': 0.95,
            'मासिक_वेतन': 0.80, 'monthly_salary': 0.80, 'गूगल_इंडिया': 0.85, 'टाइपिंग': 0.75,
            'पार्ट_टाइम': 0.85, 'रोजाना_कमाएं': 0.85,

            # --- Lottery & Prize Lures ---
            'लॉटरी': 0.95, 'lottery': 0.95, 'केबीसी': 0.95, 'kbc': 0.95, 'इनाम': 0.85,
            'विजेता': 0.80, 'winner': 0.80, 'लकी_ड्रॉ': 0.90, 'lucky_draw': 0.90,
            '25_लाख': 0.90, '25_lakh': 0.90, 'दावा_करें': 0.85, 'claim_now': 0.85,
            'बधाई_हो': 0.80, 'congratulations': 0.75, 'विदेशी_फंड': 0.95,

            # --- Free Gifts & Recharge Scams ---
            'मुफ्त': 0.80, 'फ्री': 0.80, 'free': 0.75, 'फ्री_रिचार्ज': 0.95,
            'free_recharge': 0.95, 'मुफ्त_रिचार्ज': 0.95, '84_दिन': 0.85,
            'मुकेश_अंबानी': 0.80, 'जियो': 0.65,

            # --- Fake Schemes & Subsidies ---
            'सरकारी_योजना': 0.80, 'स्मार्टफोन': 0.75, 'लैपटॉप': 0.75, 'free_laptop': 0.90,
            'बेरोजगारी_भत्ता': 0.90, 'सीधे_खाते': 0.85, 'सब्सिडी': 0.70, 'लाडली_बहना': 0.75,
            'आवेदन_करें': 0.70,

            # --- Utility Disconnection & Extortion ---
            'बिजली_बिल': 0.90, 'बिजली_कनेक्शन': 0.90, 'काट_दिया': 0.85, 'power_cut': 0.90,
            'बिजली_अधिकारी': 0.85, 'तत्काल_ऋण': 0.85, 'instant_loan': 0.85,

            # --- Urgency & Viral Chain Triggers ---
            'तुरंत': 0.75, 'turant': 0.75, 'जल्दी_करें': 0.75, 'urgent': 0.80,
            '10_लोगों': 0.85, 'शेयर_करें': 0.75, 'फॉरवर्ड_करें': 0.75,
            'अनिष्ट_होगा': 0.90, 'आज_रात': 0.75,

            # --- Fake Medical Miracles ---
            'चमत्कारी': 0.85, 'जड़_से': 0.80, 'कैंसर_ठीक': 0.90, 'रामबाण_इलाज': 0.85
        }

        # Authentic / Legitimate Tokens (Negative weights - decrease spam likelihood)
        self.genuine_token_weights = {
            # Transactional & Banking Receipts
            'लेनदेन_सफल': 0.90, 'transaction_successful': 0.90, 'संदर्भ_संख्या': 0.90,
            'utr': 0.90, 'खाते_का_शेष': 0.90, 'उपलब्ध_शेष': 0.90, 'available_balance': 0.90,
            'पावती': 0.85, 'acknowledgement': 0.85, 'ऑर्डर_कन्फर्म': 0.85, 'order_confirmed': 0.85,
            'बैठक_एजेंडा': 0.85, 'meeting_agenda': 0.85, 'वार्षिक_विवरण': 0.85, 'ई-टिकट': 0.90,
            'आरक्षण_पुष्टि': 0.90, 'pnr': 0.90, 'अंशदान_जमा': 0.85, 'आईटीआर_पावती': 0.90,
            'itr-v': 0.95, 'वेतन_पर्ची': 0.85, 'salary_slip': 0.85,

            # Institutional & Public Sources
            'रिजर्व_बैंक': 0.85, 'rbi': 0.80, 'मौसम_विभाग': 0.85, 'imd': 0.80,
            'उच्चतम_न्यायालय': 0.85, 'supreme_court': 0.85, 'संसद': 0.80,
            'स्वास्थ्य_मंत्रालय': 0.85, 'प्रेस_सूचना': 0.90, 'pib': 0.90,
            'आधिकारिक': 0.75, 'official': 0.75, 'अधिसूचना': 0.75, 'notification': 0.75,
            'सेंसेक्स': 0.70, 'रेपो_दर': 0.85, 'मुद्रास्फीति': 0.75, 'इसरो': 0.80, 'isro': 0.80
        }

    def _build_and_train_model(self):
        """
        Builds and trains the TF-IDF Vectorizer + Multinomial Naive Bayes pipeline
        using an expanded corpus of realistic Hindi, Hinglish, and Bilingual phishing emails
        and legitimate transactional/corporate/government documents.
        """
        spam_documents = [
            # 1. Income Tax Refund Phishing Emails
            "विषय आयकर विभाग आपका 42500 रुपये का टैक्स रिफंड स्वीकृत प्रिय करदाता राशि सीधे बैंक खाते में प्राप्त करने के लिए तुरंत लॉगिन करें और ओटीपी सत्यापित करें",
            "subject income tax department tax refund approved of inr 35000 click link to claim refund and verify pan card within 24 hours",
            "विषय टैक्स रिफंड सूचना वर्ष 2024-25 के लिए आपका 28400 रुपये का रिफंड पेंडिंग है नीचे दिए गए पोर्टल पर बैंक खाता विवरण और सीवीवी दर्ज करें",
            "subject urgent itr refund notice please update your net banking credentials to credit pending refund of rs 45000",
            "विषय आयकर नोटिस फॉर्म 26AS विसंगति आपका रिफंड अटका हुआ है तुरंत संलग्न रिफंड फॉर्म डाउनलोड करके आधार और पैन लिंक करें",

            # 2. Bank Account Suspension & KYC Phishing
            "विषय तत्काल सूचना आपका एसबीआई खाता 24 घंटे में ब्लॉक हो जाएगा तुरंत पैन कार्ड लिंक करें और सुरक्षा फॉर्म एपीके डाउनलोड करें",
            "subject sbi urgent notice your yono account is suspended due to pending kyc please verify netbanking immediately",
            "विषय प्रिय ग्राहक आपका एचडीएफसी बैंक खाता निष्क्रिय कर दिया गया है केवाईसी पूरा करने के लिए नीचे दिए गए लिंक पर लॉगिन करें",
            "subject hdfc bank credit card limit enhanced to 500000 click link and enter debit card number and pin to activate",
            "विषय आईसीआईसीआई नेट बैंकिंग ब्लॉक चेतावनी 24 घंटे के भीतर पासवर्ड रीसेट करें अन्यथा आपका खाता स्थायी रूप से बंद कर दिया जाएगा",
            "subject your pnb bank account will be blocked tonight download the attached kyc verification apk file immediately",
            "विषय अंतिम चेतावनी प्रिय उपभोक्ता आपका बैंक खाता और डेबिट कार्ड आज रात ब्लॉक कर दिया जाएगा तुरंत ओटीपी दर्ज करें",

            # 3. Work-From-Home & Job Scams
            "विषय बधाई गूगल इंडिया वर्क फ्रॉम होम जॉब ऑफर लेटर चयन 50000 मासिक वेतन ऑफर लेटर प्राप्त करने के लिए 999 रुपये रजिस्ट्रेशन शुल्क जमा करें",
            "subject wipro work from home job offer letter monthly salary 45000 transfer registration fee of 1500 to confirm your seat",
            "विषय डाटा एंट्री जॉब घर बैठे टाइपिंग करें और रोजाना 2000 कमाएं कोई अनुभव आवश्यक नहीं तुरंत ऑफर लेटर डाउनलोड करें",
            "subject amazon india hiring remote data entry operator daily payout click link to pay registration fee",
            "विषय पार्ट टाइम ऑनलाइन जॉब यूट्यूब वीडियो लाइक करके रोजाना 3000 कमाएं टेलीग्राम पर तुरंत संपर्क करें",

            # 4. Utility / Electricity Bill Disconnection Threat
            "विषय अंतिम नोटिस बकाया बिजली बिल आज रात 9:30 बजे बिजली काट दी जाएगी कनेक्शन बचाने के लिए एपीके फाइल इंस्टॉल करें या अधिकारी से संपर्क करें",
            "subject urgent power disconnection notice electricity bill unpaid tonight 9 30 pm power supply will be disconnected contact officer",
            "विषय बिजली विभाग सूचना आपका पिछला बिल अपडेट नहीं हुआ है तुरंत 9876543210 पर कॉल करें अन्यथा बिजली कनेक्शन काट दिया जाएगा",

            # 5. Lottery, Prize & Foreign Fund Scams
            "विषय बधाई हो आपको केबीसी की तरफ से 25 लाख की लॉटरी लगी है तुरंत संपर्क करें और पुरस्कार राशि का दावा करें",
            "subject congratulations you won 25 lakh in kbc lucky draw send processing fee 5000 to release prize money",
            "विषय भारतीय रिजर्व बैंक से 2 करोड़ रुपये का विदेशी फंड ट्रांसफर राशि क्लेम करने के लिए आधार और खाता विवरण भेजें",
            "subject rbi fund transfer notice unclaimed fund of 500000 usd pay clearing charges to claim fund",
            "विषय लकी ड्रॉ विजेता आपने जीता है मुफ्त आईफोन तुरंत नीचे दिए गए लिंक पर दावा करें",

            # 6. Free Government Schemes & Subsidies
            "विषय प्रधानमंत्री फ्री स्मार्टफोन योजना मोदी सरकार दे रही है मुफ्त लैपटॉप और फ्री 5g रिचार्ज तुरंत फॉर्म भरें",
            "विषय पीएम बेरोजगारी भत्ता योजना हर महीने 4500 रुपये सीधे बैंक खाते में पाने के लिए लिंक पर आवेदन करें",
            "विषय मुकेश अंबानी का बड़ा तोहफा जियो दे रहा है 84 दिनों का फ्री रिचार्ज आज ही क्लेम करें",
            "विषय लाडली बहना योजना 10000 रुपये सीधे खाते में लिस्ट में नाम देखने के लिए तुरंत लिंक पर क्लिक करें",

            # 7. Courier & Delivery Phishing
            "विषय इंडिया पोस्ट पार्सल डिलीवरी विफल आपका पता अधूरा होने के कारण पार्सल रोक दिया गया है तुरंत एड्रेस अपडेट लिंक खोलें",
            "subject delivery pending your parcel is held at customs pay 49 rs re delivery fee at the link"
        ]

        genuine_documents = [
            # 1. Authentic Banking & UPI Transaction Notifications
            "विषय आपके खाते से 1500 रुपये का यूपीआई भुगतान सफल संदर्भ संख्या 502910482910 खाते का शेष 14250 रुपये है",
            "subject transaction alert inr 2500 debited from sbi account ending 1234 towards upi payment utr 402910482910 available balance inr 35200",
            "विषय एचडीएफसी बैंक क्रेडिट कार्ड ई-स्टेटमेंट माह सितंबर 2026 आपका कुल देय विवरण संलग्न पासवर्ड संरक्षित पीडीएफ में उपलब्ध है",
            "subject icici bank account monthly statement your account statement for period sep 2026 is attached",
            "विषय वेतन पर्ची माह सितंबर 2026 आपका मासिक वेतन बैंक खाते में क्रेडिट कर दिया गया है कृपया संलग्न विवरण देखें",
            "subject salary credit notification your monthly salary has been credited to your account reference ref9820124",

            # 2. Authentic Government & Tax Notices
            "विषय आयकर विवरणी आईटीआर पावती वर्ष 2025-26 आपकी विवरणी सफलतापूर्वक सत्यापित हो गई है पावती संख्या 89201928374",
            "subject income tax return acknowledgement assessment year 2025 26 itr v successfully verified acknowledgement number 89201928374",
            "विषय ईपीएफओ सदस्य पासबुक विवरण आपके पीएफ खाते में माह का अंशदान जमा कर दिया गया है विवरण उमंग ऐप अथवा आधिकारिक पोर्टल पर देखें",
            "subject epfo passbook update monthly contribution of inr 3600 credited to uan 100928340129",
            "विषय बिजली बिल भुगतान पावती उपभोक्ता संख्या 109283 राशि 2450 रुपये प्राप्त हुई समय पर भुगतान के लिए धन्यवाद",

            # 3. Authentic Travel & E-Commerce Confirmations
            "विषय आईआरसीटीसी ई-टिकट आरक्षण पुष्टि पीएनआर 245-8910234 ट्रेन 12952 राजधानी एक्सप्रेस नई दिल्ली से मुंबई शुभ यात्रा",
            "subject irctc booking confirmation pnr 2458910234 3ac confirmed departure 16 55 hrs happy journey",
            "विषय आपका फ्लिपकार्ट ऑर्डर कन्फर्म हो गया है ऑर्डर आईडी 9283401 डिलीवरी अपेक्षित तिथि 15 अक्टूबर ट्रैकिंग विवरण उपलब्ध",
            "subject amazon order confirmed order 402 9182390 expected delivery wednesday track package online",

            # 4. Corporate & Workplace Communications
            "विषय वार्षिक परियोजना समीक्षा बैठक का एजेंडा सभी टीम सदस्यों से कल सुबह 10:30 बजे उपस्थित रहने का अनुरोध",
            "subject quarterly sprint review meeting agenda please join tomorrow 10 30 am via google meet",
            "विषय अवकाश आवेदन स्वीकृति आपका 3 दिवसीय आकस्मिक अवकाश स्वीकृत कर दिया गया है मानव संसाधन विभाग",

            # 5. Public News & Official Bulletins
            "भारतीय रिजर्व बैंक ने मौद्रिक नीति समीक्षा में प्रमुख रेपो दर को 6.5 प्रतिशत पर यथावत रखा है",
            "मौसम विभाग आईएमडी ने तटीय क्षेत्रों में भारी बारिश का ऑरेंज अलर्ट जारी किया है नागरिकों को सतर्क रहने की सलाह दी गई",
            "प्रेस सूचना ब्यूरो पीआईबी ने स्पष्ट किया कि सोशल मीडिया पर वायरल सरकारी भर्ती नोटिस फर्जी है आधिकारिक पोर्टल पर ही भरोसा करें",
            "उच्चतम न्यायालय ने संविधान पीठ के समक्ष याचिका पर सुनवाई करते हुए केंद्र सरकार से हलफनामा मांगा",
            "इसरो ने सूर्य का अध्ययन करने वाले आदित्य एल1 उपग्रह से प्राप्त आंकड़ों का प्रारंभिक विश्लेषण सार्वजनिक किया"
        ]

        X = spam_documents + genuine_documents
        y = [1] * len(spam_documents) + [0] * len(genuine_documents)

        self.vectorizer = TfidfVectorizer(
            tokenizer=NLPPreprocessor.tokenize,
            ngram_range=(1, 2),
            sublinear_tf=True
        )

        self.classifier = MultinomialNB(alpha=0.3)
        X_tfidf = self.vectorizer.fit_transform(X)
        self.classifier.fit(X_tfidf, y)

    def is_hindi(self, text: str) -> bool:
        """Determines if text contains Hindi or Hinglish keywords."""
        return self.preprocessor.is_hindi(text)

    def parse_email_text(self, text: str) -> Dict[str, str]:
        """
        Parses raw email text into Subject, From, To, and Body.
        Supports both English and Hindi header markers (Subject / विषय, From / प्रेषक).
        """
        lines = text.strip().split('\n')
        subject = ""
        sender = ""
        recipient = ""
        body_lines = []
        is_header = True

        subject_pattern = re.compile(r'^(?:subject|विषय|sub):\s*(.*)$', re.IGNORECASE)
        from_pattern = re.compile(r'^(?:from|प्रेषक|sender):\s*(.*)$', re.IGNORECASE)
        to_pattern = re.compile(r'^(?:to|प्राप्तकर्ता):\s*(.*)$', re.IGNORECASE)

        for line in lines:
            line_strip = line.strip()
            if is_header:
                sub_match = subject_pattern.match(line_strip)
                if sub_match:
                    subject = sub_match.group(1).strip()
                    continue
                from_match = from_pattern.match(line_strip)
                if from_match:
                    sender = from_match.group(1).strip()
                    continue
                to_match = to_pattern.match(line_strip)
                if to_match:
                    recipient = to_match.group(1).strip()
                    continue
                if not line_strip:
                    is_header = False
                    continue
            body_lines.append(line)

        body = "\n".join(body_lines).strip()
        if not subject and not sender:
            body = text.strip()

        return {
            'subject': subject,
            'sender': sender,
            'recipient': recipient,
            'body': body
        }

    def check_sender_reputation(self, sender: str, body_text: str = '') -> Dict[str, Any]:
        """
        Analyzes the sender's email address and domain for phishing indicators:
        1. Free-webmail impersonation (claims to be SBI/Income Tax but uses @gmail.com)
        2. Suspicious TLDs (.xyz, .top, .click, etc.)
        3. Spoofed domain lookalikes vs trusted institutional domains
        """
        if not sender:
            return {
                'has_sender': False,
                'is_suspicious': False,
                'is_trusted': False,
                'sender': '',
                'domain': '',
                'reason': 'Sender address not specified in email headers.'
            }

        sender_clean = sender.lower().strip()
        email_match = re.search(r'[\w\.-]+@([\w\.-]+\.\w+)', sender_clean)
        domain = email_match.group(1) if email_match else sender_clean

        # Check if sender matches trusted official domain
        is_trusted = False
        trusted_institution_name = ""
        for legit_domain, inst_title in OFFICIAL_INSTITUTIONAL_DOMAINS.items():
            if domain == legit_domain or domain.endswith('.' + legit_domain):
                is_trusted = True
                trusted_institution_name = inst_title
                break

        if is_trusted:
            return {
                'has_sender': True,
                'is_suspicious': False,
                'is_trusted': True,
                'sender': sender,
                'domain': domain,
                'reason': f"Verified official sender domain: {trusted_institution_name} ({domain})."
            }

        is_suspicious = False
        reasons = []

        # Check suspicious TLDs
        for tld in SUSPICIOUS_TLDS:
            if domain.endswith(tld):
                is_suspicious = True
                reasons.append(f"Suspicious high-risk domain extension ({tld}) commonly used by fraud networks.")

        # Check Brand / Institution Impersonation
        combined_text = (sender_clean + " " + body_text.lower())
        institutions = [
            ('sbi', 'State Bank of India (SBI)', 'sbi.co.in'),
            ('incometax', 'Income Tax Department', 'incometax.gov.in'),
            ('income tax', 'Income Tax Department', 'incometax.gov.in'),
            ('आयकर', 'Income Tax Department', 'incometax.gov.in'),
            ('rbi', 'Reserve Bank of India (RBI)', 'rbi.org.in'),
            ('hdfc', 'HDFC Bank', 'hdfcbank.com'),
            ('icici', 'ICICI Bank', 'icicibank.com'),
            ('epfo', 'EPFO India', 'epfindia.gov.in'),
            ('google', 'Google India', 'google.com'),
            ('irctc', 'IRCTC Railways', 'irctc.co.in')
        ]

        for keyword, inst_name, legit_domain in institutions:
            if keyword in combined_text:
                # If text claims to be this institution but sender domain is free webmail
                is_free_webmail = any(domain == f_domain or domain.endswith('.' + f_domain) for f_domain in FREE_WEBMAIL_DOMAINS)
                if is_free_webmail:
                    is_suspicious = True
                    reasons.append(
                        f"Impersonation alert: Claims to represent {inst_name} but originates from a free webmail provider ({domain}). "
                        f"Official entities only send from verified @{legit_domain} domains."
                    )
                elif not domain.endswith(legit_domain):
                    is_suspicious = True
                    reasons.append(
                        f"Domain mismatch: Email claims to represent {inst_name}, but sender domain '{domain}' is unauthorized. "
                        f"Official domain is @{legit_domain}."
                    )

        return {
            'has_sender': True,
            'is_suspicious': is_suspicious,
            'is_trusted': False,
            'sender': sender,
            'domain': domain,
            'reason': " • ".join(reasons) if reasons else "Standard third-party domain."
        }

    def check_attachment_risk(self, text: str) -> Dict[str, Any]:
        """
        Detects dangerous attachments or download instructions (.apk, .exe, .zip, etc.).
        """
        text_lower = text.lower()
        found_extensions = []
        for ext in RISKY_ATTACHMENT_EXTENSIONS:
            if ext in text_lower or f"{ext[1:]} file" in text_lower or f"{ext[1:]} फ़ाइल" in text_lower or f"{ext[1:]} फाइल" in text_lower:
                found_extensions.append(ext)

        # Devanagari transliterations
        devanagari_map = {
            'एपीके': '.apk', 'apk': '.apk',
            'ज़िप': '.zip', 'जिप': '.zip',
            'ईएक्सई': '.exe'
        }
        for de_key, ext_val in devanagari_map.items():
            if de_key in text_lower and ext_val not in found_extensions:
                found_extensions.append(ext_val)

        has_risk = len(found_extensions) > 0
        return {
            'has_risky_attachment': has_risk,
            'extensions_found': found_extensions,
            'warning': f"High risk attachment types detected: {', '.join(found_extensions)}. Fraudsters distribute trojans and spyware via APK/ZIP files." if has_risk else "No dangerous attachment types detected."
        }

    def analyze_tokens(self, text: str) -> Dict[str, Any]:
        """
        Deconstructs text step-by-step using first-principles NLP.
        """
        raw_tokens = self.preprocessor.tokenize(text)
        filtered_tokens = self.preprocessor.remove_stopwords(raw_tokens)
        bigrams = self.preprocessor.get_ngrams(filtered_tokens, n=2)
        trigrams = self.preprocessor.get_ngrams(filtered_tokens, n=3)

        all_features = filtered_tokens + bigrams + trigrams

        found_spam_tokens = []
        spam_weight_sum = 0.0
        seen_spam = set()
        for feat in all_features:
            if feat in self.spam_token_weights and feat not in seen_spam:
                seen_spam.add(feat)
                weight = self.spam_token_weights[feat]
                found_spam_tokens.append({'token': feat, 'weight': weight})
                spam_weight_sum += weight

        found_genuine_tokens = []
        genuine_weight_sum = 0.0
        seen_gen = set()
        for feat in all_features:
            if feat in self.genuine_token_weights and feat not in seen_gen:
                seen_gen.add(feat)
                weight = self.genuine_token_weights[feat]
                found_genuine_tokens.append({'token': feat, 'weight': weight})
                genuine_weight_sum += weight

        return {
            'total_raw_tokens': len(raw_tokens),
            'raw_tokens': raw_tokens[:25],
            'filtered_tokens_count': len(filtered_tokens),
            'filtered_tokens': filtered_tokens[:20],
            'bigrams': bigrams[:12],
            'found_spam_tokens': found_spam_tokens,
            'spam_lexical_score': round(spam_weight_sum, 3),
            'found_genuine_tokens': found_genuine_tokens,
            'genuine_lexical_score': round(genuine_weight_sum, 3)
        }

    def detect_email_spam(self, subject: str = '', body: str = '', sender: str = '', raw_text: str = '') -> Dict[str, Any]:
        """
        Specialized Hindi Spam & Phishing Email Detection:
        - Analyzes Subject line independently (1.5x weight multiplier)
        - Analyzes Body content with Devanagari NLP tokenization
        - Checks Sender domain credibility and spoofing heuristics
        - Inspects attachments and suspicious links
        - Fuses ML Naive Bayes probability and rule-based heuristics
        """
        if raw_text and (not subject and not body):
            parsed = self.parse_email_text(raw_text)
            subject = parsed['subject']
            body = parsed['body']
            if not sender and parsed['sender']:
                sender = parsed['sender']

        combined_text = f"{subject} {body}".strip()
        is_hindi_lang = self.preprocessor.is_hindi(combined_text)

        # Subject Line Analysis (High priority intent signal)
        subject_tokens = self.analyze_tokens(subject) if subject else None
        subject_spam_score = subject_tokens['spam_lexical_score'] if subject_tokens else 0.0

        # Body Analysis
        body_tokens = self.analyze_tokens(body if body else combined_text)
        body_spam_score = body_tokens['spam_lexical_score']

        # ML Naive Bayes Probability
        cleaned = self.preprocessor.clean_text(combined_text)
        if cleaned:
            vec = self.vectorizer.transform([cleaned])
            probs = self.classifier.predict_proba(vec)[0]
            ml_spam_prob = float(probs[1])
        else:
            ml_spam_prob = 0.5

        # Sender & Attachment Heuristics
        sender_analysis = self.check_sender_reputation(sender, combined_text)
        attachment_analysis = self.check_attachment_risk(combined_text)

        # Urgent Call-to-Action (CTA) Threat Extraction
        urgent_cta_patterns = [
            ('24 hours', '24 घंटे के भीतर (Within 24 Hours)'),
            ('24 घंटे', '24 घंटे के भीतर (Within 24 Hours)'),
            ('तत्काल', 'तत्काल कार्रवाई आवश्यक (Immediate Action Required)'),
            ('urgent', 'तत्काल कार्रवाई आवश्यक (Immediate Action Required)'),
            ('खाता ब्लॉक', 'खाता ब्लॉक करने की धमकी (Account Block Threat)'),
            ('account blocked', 'खाता ब्लॉक करने की धमकी (Account Block Threat)'),
            ('खाता निलंबित', 'खाता निलंबन चेतावनी (Account Suspension Warning)'),
            ('account suspended', 'खाता निलंबन चेतावनी (Account Suspension Warning)'),
            ('पासवर्ड रीसेट', 'क्रेडेंशियल रीसेट मांग (Credential Reset Request)'),
            ('password reset', 'क्रेडेंशियल रीसेट मांग (Credential Reset Request)'),
            ('ओटीपी', 'ओटीपी सत्यापन मांग (OTP Harvesting)'),
            ('otp', 'ओटीपी सत्यापन मांग (OTP Harvesting)'),
            ('पैन कार्ड', 'पैन कार्ड लिंकिंग दबाव (PAN Card Harvesting)'),
            ('pan card', 'पैन कार्ड लिंकिंग दबाव (PAN Card Harvesting)'),
            ('अंतिम चेतावनी', 'अंतिम चेतावनी (Final Warning Notice)'),
            ('last warning', 'अंतिम चेतावनी (Final Warning Notice)'),
            ('पंजीकरण शुल्क', 'अग्रिम पंजीकरण शुल्क मांग (Advance Fee Scam)'),
            ('registration fee', 'अग्रिम पंजीकरण शुल्क मांग (Advance Fee Scam)'),
            ('बिजली काट', 'बिजली डिस्कनेक्शन धमकी (Power Cut Threat)')
        ]

        lower_comb = combined_text.lower()
        found_urgent_ctas = []
        for pat, label in urgent_cta_patterns:
            if pat in lower_comb and label not in found_urgent_ctas:
                found_urgent_ctas.append(label)

        # Holistic Score Fusion
        # Email score combines: ML prob (35%), Lexical tokens (35%), Subject hooks (15%), Sender risk (15%)
        combined_lexical = (subject_spam_score * 1.5) + body_spam_score
        normalized_lexical = min(combined_lexical / 3.0, 1.0)

        final_score = (ml_spam_prob * 0.35) + (normalized_lexical * 0.35)

        if sender_analysis['is_suspicious']:
            final_score += 0.20
        elif sender_analysis.get('is_trusted'):
            final_score -= 0.35

        if attachment_analysis['has_risky_attachment']:
            final_score += 0.15

        if found_urgent_ctas:
            final_score += min(len(found_urgent_ctas) * 0.05, 0.15)

        if body_tokens['genuine_lexical_score'] > 0.8:
            final_score -= min(body_tokens['genuine_lexical_score'] * 0.2, 0.4)

        final_score = max(0.0, min(1.0, final_score))

        # Email Categorization
        email_categories = []
        if any(k in lower_comb for k in ['आयकर', 'टैक्स', 'रिफंड', 'tax refund', 'itr refund', 'फॉर्म 26as', 'form 26as']):
            email_categories.append('Income Tax Refund Phishing')
        if any(k in lower_comb for k in ['खाता निलंबित', 'खाता ब्लॉक', 'नेट बैंकिंग', 'केवाईसी', 'sbi', 'hdfc', 'icici', 'pnb', 'account blocked', 'kyc']):
            email_categories.append('Banking & KYC Phishing')
        if any(k in lower_comb for k in ['जॉब ऑफर', 'ऑफर लेटर', 'वर्क फ्रॉम होम', 'डाटा एंट्री', 'पंजीकरण शुल्क', 'job offer', 'work from home', 'registration fee']):
            email_categories.append('Work-From-Home / Job Scam')
        if any(k in lower_comb for k in ['लॉटरी', 'इनाम', '25 लाख', 'विदेशी फंड', 'lottery', 'kbc', 'prize']):
            email_categories.append('Lottery / Fund Transfer Scam')
        if any(k in lower_comb for k in ['बिजली बिल', 'बिजली काट', 'बिजली कनेक्शन', 'power cut', 'electricity bill']):
            email_categories.append('Utility / Electricity Bill Phishing')
        if any(k in lower_comb for k in ['मुफ्त लैपटॉप', 'फ्री रिचार्ज', 'योजना', 'free recharge', 'laptop yojana']):
            email_categories.append('Government Scheme / Freebie Scam')

        # Verdict Determination
        is_spam = False
        if final_score >= 0.52 or sender_analysis['is_suspicious'] or (subject_spam_score > 0.8 and body_spam_score > 0.8):
            result = 'false'  # Flagged as Spam / Phishing
            is_spam = True
            confidence = round(max(final_score, 0.86), 2)
            educational_tip = (
                "🚨 Phishing Alert: This email is designed to deceive you by impersonating an official bank, "
                "government department, or corporate brand. Never click external verification links or download "
                "attachments. Official banks and government entities in India never request passwords, OTPs, "
                "or advance fees via email. Report immediately to the National Cyber Crime Reporting Portal (cybercrime.gov.in) "
                "or call the toll-free Helpline 1930."
            )
        elif final_score >= 0.32:
            result = 'questionable'
            is_spam = False
            confidence = round(max(final_score, 0.65), 2)
            educational_tip = (
                "⚠️ Caution: This email contains suspicious urgency signals or unverified claims. "
                "Verify the sender's exact email domain against official channels before taking any action or clicking links."
            )
        else:
            result = 'verified'
            is_spam = False
            confidence = round(1.0 - final_score, 2)
            educational_tip = (
                "✅ Legitimate Content: NLP token analysis and domain reputation checks detected no malicious phishing "
                "patterns. The email matches standard transactional or administrative notification structures."
            )

        # Official Verification & Cyber Defense Portals
        trusted_sources = [
            {
                'name': 'National Cyber Crime Reporting Portal (CyberCrime.gov.in)',
                'url': 'https://cybercrime.gov.in',
                'description': 'Official portal of the Ministry of Home Affairs to report phishing and cyber financial fraud (Helpline: 1930).'
            },
            {
                'name': 'PIB Fact Check (Press Information Bureau)',
                'url': 'https://factcheck.pib.gov.in',
                'description': 'Official Government of India verification unit debunking fake job notices and fraudulent schemes.'
            },
            {
                'name': 'Vishvas News (विश्वास न्यूज़)',
                'url': 'https://www.vishvasnews.com',
                'description': 'IFCN-certified fact-checking portal verifying viral Hindi and regional misinformation.'
            },
            {
                'name': 'BOOM FactCheck',
                'url': 'https://hindi.boomlive.in',
                'description': 'Independent Hindi and English fact-checking service covering online scams.'
            }
        ]

        all_spam_triggers = []
        if subject_tokens:
            all_spam_triggers.extend([t['token'] for t in subject_tokens['found_spam_tokens']])
        all_spam_triggers.extend([t['token'] for t in body_tokens['found_spam_tokens']])
        unique_triggers = list(dict.fromkeys(all_spam_triggers))

        return {
            'is_spam': is_spam,
            'result': result,
            'confidence_score': confidence,
            'is_hindi': is_hindi_lang,
            'spam_score': round(final_score, 3),
            'content_type': 'email',
            'email_details': {
                'subject': subject,
                'sender': sender,
                'subject_spam_score': round(subject_spam_score, 3),
                'body_spam_score': round(body_spam_score, 3),
                'sender_analysis': sender_analysis,
                'attachment_analysis': attachment_analysis,
                'urgent_ctas_detected': found_urgent_ctas,
                'email_categories': email_categories if email_categories else ['General Inquiry / Transaction']
            },
            'nlp_tokenization': {
                'raw_tokens_count': body_tokens['total_raw_tokens'],
                'filtered_tokens_count': body_tokens['filtered_tokens_count'],
                'sample_tokens': body_tokens['filtered_tokens'],
                'spam_tokens_detected': unique_triggers,
                'genuine_tokens_detected': [t['token'] for t in body_tokens['found_genuine_tokens']],
                'ml_naive_bayes_spam_probability': round(ml_spam_prob, 3)
            },
            'educational_tip': educational_tip,
            'hindi_sources': trusted_sources,
            'sources': trusted_sources,
            'analysis_details': {
                'language_detected': 'Hindi / Hinglish' if is_hindi_lang else 'English / Other',
                'nlp_methodology': 'Email Phishing Analyzer + Devanagari Tokenization + TF-IDF + MultinomialNB',
                'risk_level': 'High Phishing Risk' if is_spam else ('Moderate Risk' if result == 'questionable' else 'Safe & Legitimate'),
                'categories_detected': email_categories if email_categories else ['Standard Notification'],
                'triggers_found': unique_triggers
            }
        }

    def detect_spam(self, text: str) -> Dict[str, Any]:
        """
        Multi-format Spam Detection Method for Text/SMS and Auto-Detected Emails.
        """
        if not text or not text.strip():
            return {
                'is_spam': False,
                'result': 'unverified',
                'confidence_score': 0.0,
                'is_hindi': False,
                'educational_tip': 'Please enter text or email content to verify.',
                'analysis_details': {'error': 'Empty input content.'}
            }

        # Check if the content is structured as an email
        has_email_markers = bool(re.search(r'(?:subject|विषय|from|प्रेषक|sender):\s*', text, re.IGNORECASE))
        if has_email_markers:
            parsed = self.parse_email_text(text)
            if parsed['subject'] or parsed['sender']:
                return self.detect_email_spam(
                    subject=parsed['subject'],
                    body=parsed['body'],
                    sender=parsed['sender']
                )

        is_hindi_lang = self.preprocessor.is_hindi(text)

        # Regular Text / SMS Verification
        token_analysis = self.analyze_tokens(text)
        cleaned = self.preprocessor.clean_text(text)
        if cleaned:
            vec = self.vectorizer.transform([cleaned])
            probs = self.classifier.predict_proba(vec)[0]
            ml_spam_prob = float(probs[1])
        else:
            ml_spam_prob = 0.5

        lexical_signal = min(token_analysis['spam_lexical_score'] / 2.0, 1.0)
        final_score = (ml_spam_prob * 0.6) + (lexical_signal * 0.4)

        if token_analysis['genuine_lexical_score'] > 0.8:
            final_score -= min(token_analysis['genuine_lexical_score'] * 0.25, 0.5)
        final_score = max(0.0, min(1.0, final_score))

        if not is_hindi_lang and not token_analysis['found_spam_tokens']:
            result = 'questionable'
            is_spam = False
            confidence = 0.50
            educational_tip = (
                "Notice: This NLP engine is optimized for Hindi, Hinglish, and regional Indian contexts. "
                "For highest accuracy, verify messages in Hindi or Hinglish."
            )
        elif final_score >= 0.52 or len(token_analysis['found_spam_tokens']) >= 2:
            result = 'false'
            is_spam = True
            confidence = round(max(final_score, 0.85), 2)
            top_triggers = [t['token'].replace('_', ' ') for t in token_analysis['found_spam_tokens'][:3]]
            trigger_str = ", ".join(f"'{tr}'" for tr in top_triggers) if top_triggers else "fraud signals"
            educational_tip = (
                f"🚨 Warning: NLP analysis detected known spam patterns ({trigger_str}). "
                "This message exhibits characteristics of lottery fraud, fake recharge schemes, or financial extortion. "
                "Do not click links or forward to others."
            )
        elif final_score >= 0.30 or token_analysis['found_spam_tokens']:
            result = 'questionable'
            is_spam = False
            confidence = round(max(final_score, 0.65), 2)
            educational_tip = (
                "⚠️ Caution: This message shows signs of unverified claims or artificial urgency. "
                "Verify with official sources before believing or sharing."
            )
        else:
            result = 'verified'
            is_spam = False
            confidence = round(1.0 - final_score, 2)
            educational_tip = (
                "✅ Legitimate Content: NLP token analysis found no deceptive or spam triggers. "
                "The message structure matches verified authentic information."
            )

        trusted_sources = [
            {
                'name': 'PIB Fact Check (Press Information Bureau)',
                'url': 'https://factcheck.pib.gov.in',
                'description': 'Official fact-checking unit of the Government of India.'
            },
            {
                'name': 'Vishvas News (विश्वास न्यूज़)',
                'url': 'https://www.vishvasnews.com',
                'description': 'IFCN certified fact-checker covering viral Hindi claims and WhatsApp forwards.'
            },
            {
                'name': 'BOOM FactCheck',
                'url': 'https://hindi.boomlive.in',
                'description': 'Independent fact-checking organization for digital misinformation.'
            },
            {
                'name': 'Alt News Hindi',
                'url': 'https://hindi.altnews.in',
                'description': 'Non-profit fact-checking website investigating viral social media rumors.'
            }
        ]

        matched_categories = []
        for t in token_analysis['found_spam_tokens']:
            tok = t['token']
            if any(k in tok for k in ['लॉटरी', 'केबीसी', 'kbc', 'इनाम', 'लकी_ड्रॉ', '25_लाख', 'lottery']):
                matched_categories.append('Lottery / Prize Scam')
            elif any(k in tok for k in ['फ्री', 'मुफ्त', 'रिचार्ज', 'डेटा', 'free_recharge']):
                matched_categories.append('Free Recharge / Data Scam')
            elif any(k in tok for k in ['योजना', 'स्मार्टफोन', 'लैपटॉप', 'बेरोजगारी_भत्ता', 'खाते', 'yojana']):
                matched_categories.append('Fake Government Scheme')
            elif any(k in tok for k in ['बिजली', 'ब्लॉक', 'केवाईसी', 'ओटीपी', 'apk', 'kyc']):
                matched_categories.append('Banking / Utility Phishing Threat')
            elif any(k in tok for k in ['10_लोगों', 'शेयर', 'फॉरवर्ड', 'शुभ_समाचार', 'अनिष्ट']):
                matched_categories.append('WhatsApp Chain Forward')
            elif any(k in tok for k in ['चमत्कारी', 'जड़_से', 'कैंसर', 'रामबाण']):
                matched_categories.append('Fake Medical Miracle Claim')

        unique_categories = list(dict.fromkeys(matched_categories))

        return {
            'is_spam': is_spam,
            'result': result,
            'confidence_score': confidence,
            'is_hindi': is_hindi_lang,
            'spam_score': round(final_score, 3),
            'matched_categories': unique_categories,
            'nlp_tokenization': {
                'raw_tokens_count': token_analysis['total_raw_tokens'],
                'filtered_tokens_count': token_analysis['filtered_tokens_count'],
                'sample_tokens': token_analysis['filtered_tokens'],
                'spam_tokens_detected': [t['token'] for t in token_analysis['found_spam_tokens']],
                'genuine_tokens_detected': [t['token'] for t in token_analysis['found_genuine_tokens']],
                'ml_naive_bayes_spam_probability': round(ml_spam_prob, 3)
            },
            'educational_tip': educational_tip,
            'hindi_sources': trusted_sources,
            'sources': trusted_sources,
            'analysis_details': {
                'language_detected': 'Hindi / Hinglish' if is_hindi_lang else 'English / Other',
                'nlp_methodology': 'Tokenization + Stopwords Filter + TF-IDF Vectorization + Naive Bayes Classifier',
                'risk_level': 'High Risk' if is_spam else ('Moderate Risk' if result == 'questionable' else 'Safe & Legitimate'),
                'categories_detected': unique_categories if unique_categories else ['Standard Message'],
                'triggers_found': [t['token'] for t in token_analysis['found_spam_tokens']]
            }
        }


# Singleton instance
hindi_spam_detector = HindiSpamDetector()
