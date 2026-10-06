import urllib.request
import json

cases = [
    {
        'name': 'Hindi ITR Phishing Email',
        'payload': {
            'content_type': 'email',
            'subject': 'आयकर विभाग: आपका ₹42,500 का टैक्स रिफंड स्वीकृत',
            'sender': 'refund-tax@incometax-gov-update.xyz',
            'body': 'प्रिय करदाता, आपके 2024-25 का आयकर रिफंड स्वीकृत हुआ। 24 घंटे के भीतर नेट बैंकिंग से लॉगिन करें और ओटीपी दर्ज करें: http://it-refund.xyz'
        }
    },
    {
        'name': 'SBI KYC Block Scam Email',
        'payload': {
            'content_type': 'email',
            'subject': 'तत्काल सूचना: आपका एसबीआई खाता 24 घंटे में ब्लॉक हो जाएगा',
            'sender': 'security@sbi-kyc-verify.top',
            'body': 'प्रिय ग्राहक, आपका नेट बैंकिंग खाता निष्क्रिय किया जा रहा है। तुरंत सुरक्षा फॉर्म एपीके फाइल डाउनलोड करें और केवाईसी अपडेट करें।'
        }
    },
    {
        'name': 'Genuine SBI Alert Email',
        'payload': {
            'content_type': 'email',
            'subject': 'आपके खाते से ₹1,500 का यूपीआई भुगतान सफल',
            'sender': 'alerts@sbi.co.in',
            'body': 'प्रिय ग्राहक, आपके खाता संख्या 1234 से ₹1,500.00 का यूपीआई डेबिट संपन्न हुआ। UTR: 402910482910। शेष: ₹18,450.00।'
        }
    },
    {
        'name': 'Hindi WhatsApp Lottery Text',
        'payload': {
            'content_type': 'text',
            'content': 'बधाई हो! आपने KBC में 25 लाख रुपये की लॉटरी जीती है। तुरंत इस नंबर पर संपर्क करें।'
        }
    }
]

for c in cases:
    req = urllib.request.Request(
        'http://127.0.0.1:5001/api/verify',
        data=json.dumps(c['payload']).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    print(f"{c['name']}: Result={res['result']} | IsSpam={res['is_spam']} | Conf={res['confidence_score']}")
    if 'email_details' in res and res['email_details']:
        print('   Categories:', res['email_details']['email_categories'])
        print('   Sender Analysis:', res['email_details']['sender_analysis']['reason'])
        print('   Urgent CTAs:', res['email_details']['urgent_ctas_detected'])
