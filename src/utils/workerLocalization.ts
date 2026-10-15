import type { Worker } from '../types';
import type { AppLanguage } from '../i18n';
import { translateUiText } from '../i18n';

const nameWords: Record<string, string> = {
  Ramesh: 'रमेश', Sanjay: 'संजय', Manoj: 'मनोज', Deepak: 'दीपक', Rajesh: 'राजेश',
  Sunita: 'सुनीता', Pooja: 'पूजा', Anil: 'अनिल', Ganesh: 'गणेश', Kavita: 'कविता',
  Santosh: 'संतोष', Dinesh: 'दिनेश', Sachin: 'सचिन', Pravin: 'प्रवीण', Vijay: 'विजय',
  Rahul: 'राहुल', Mukesh: 'मुकेश', Vinod: 'विनोद', Suresh: 'सुरेश', Bablu: 'बबलू',
  Naresh: 'नरेश', Arun: 'अरुण', Pankaj: 'पंकज', Ajay: 'अजय', Laxman: 'लक्ष्मण',
  Ashok: 'अशोक', Mahesh: 'महेश', Kishore: 'किशोर', Nitin: 'नितिन', Raju: 'राजू',
  Patil: 'पाटिल', Sharma: 'शर्मा', Kumar: 'कुमार', Yadav: 'यादव', Shinde: 'शिंदे',
  Rathod: 'राठौड़', Jadhav: 'जाधव', Chavan: 'चव्हाण', Pawar: 'पवार', More: 'मोरे',
  Sawant: 'सावंत', Mishra: 'मिश्रा', Gupta: 'गुप्ता', Verma: 'वर्मा', Gaikwad: 'गायकवाड़',
  Kamble: 'कांबले', Kadam: 'कदम', Bhosale: 'भोसले', Tiwari: 'तिवारी', Singh: 'सिंह',
  Vishwakarma: 'विश्वकर्मा', Chauhan: 'चौहान', Devi: 'देवी', Malhotra: 'मल्होत्रा',
  Mathur: 'माथुर', Agarwal: 'अग्रवाल', Singhania: 'सिंघानिया', Desai: 'देसाई', Mehra: 'मेहरा',
  Iyer: 'अय्यर', Secretary: 'सचिव'
};

const localityWords: Record<string, string> = {
  'Andheri East': 'अंधेरी ईस्ट', 'Andheri West': 'अंधेरी वेस्ट', 'Kurla West': 'कुर्ला वेस्ट',
  Kurla: 'कुर्ला', 'Bandra West': 'बांद्रा वेस्ट', Bandra: 'बांद्रा', Powai: 'पवई',
  Ghatkopar: 'घाटकोपर', Borivali: 'बोरीवली', Kandivali: 'कांदिवली', Malad: 'मलाड',
  'Borivali West': 'बोरीवली वेस्ट', 'Kandivali East': 'कांदिवली ईस्ट',
  'Malad West': 'मलाड वेस्ट', Goregaon: 'गोरेगाँव', 'Goregaon East': 'गोरेगाँव ईस्ट',
  Dadar: 'दादर', 'Dadar Central': 'दादर सेंट्रल', 'Lower Parel': 'लोअर परेल',
  'Chembur East': 'चेंबूर ईस्ट', Chembur: 'चेंबूर', 'Mulund West': 'मुलुंड वेस्ट', Mulund: 'मुलुंड',
  Vashi: 'वाशी', Nerul: 'नेरुल', Belapur: 'बेलापुर',
  'CBD Belapur': 'सीबीडी बेलापुर', Kharghar: 'खारघर', Airoli: 'ऐरोली', Ghansoli: 'घनसोली',
  'Kopar Khairane': 'कोपर खैराने', Sanpada: 'सानपाड़ा', Panvel: 'पनवेल', Seawoods: 'सीवुड्स',
  'New Panvel': 'न्यू पनवेल', 'Saki Naka': 'साकी नाका', 'Mumbai': 'मुंबई', 'Navi Mumbai': 'नवी मुंबई'
};

const specialSkills: Record<string, string> = {
  'DB panel installations': 'DB पैनल लगाना',
  'GROHE/Jaguar fitting': 'GROHE/Jaguar फिटिंग',
  'Hydraulic hinge alignment': 'हाइड्रोलिक कब्ज़ों की सेटिंग',
  'Asian Paints Royale finish': 'एशियन पेंट्स रॉयल फ़िनिश',
  'Terrace waterproofing plaster': 'छत पर वॉटरप्रूफ़िंग प्लास्टर',
  'Granite door frame fixing': 'ग्रेनाइट दरवाज़े का फ़्रेम लगाना',
  'Safety grill fabrication': 'सुरक्षा ग्रिल बनाना',
  'Overhead water tank scrubbing': 'ऊपरी पानी की टंकी की सफ़ाई',
  'Concrete batching': 'कंक्रीट का मिश्रण तैयार करना',
  'Granite platform moulding': 'ग्रेनाइट प्लेटफ़ॉर्म की ढलाई'
};

const primaryWorkExperience: Record<string, string> = {
  ramesh: 'अंधेरी ईस्ट और पवई में घरों की वायरिंग, DB पैनल लगाना और अपार्टमेंट की री-वायरिंग का अनुभव। मल्टीमीटर, इंसुलेटेड प्लायर और टेस्ट पेन उपलब्ध हैं।',
  'worker-suresh-sharma': 'कुर्ला वेस्ट और बांद्रा में कमर्शियल रसोई की ड्रेनेज, बहुमंज़िला CPVC पाइप बदलने और GROHE/Jaguar फिटिंग का अनुभव।',
  'worker-rajesh-vishwakarma': 'बांद्रा वेस्ट में शोरूम के अंदर लकड़ी का फ़्रेम बनाना, हाइड्रोलिक कब्ज़ों की सेटिंग और Godrej लॉक लगाने का अनुभव।',
  'worker-anil-chauhan': 'मलाड और कांदिवली में घरों की पूरी इंटीरियर रंगाई, एशियन पेंट्स रॉयल फ़िनिश और धातु के शटर पर प्राइमर लगाने का अनुभव।',
  'worker-ganesh-yadav': 'पवई में घरों की कंपाउंड वॉल बनाना, छत पर वॉटरप्रूफ़िंग प्लास्टर और ग्रेनाइट दरवाज़े का फ़्रेम लगाने का अनुभव।',
  'worker-vikram-shinde': 'वाशी में गोदामों के स्लाइडिंग गेट, सुरक्षा ग्रिल और लोहे की सीढ़ी की रेलिंग बनाने व वेल्डिंग का अनुभव।',
  'worker-sunita-devi': 'साकी नाका में निर्माण के बाद फ़्लैट की गहरी सफ़ाई, कमर्शियल वॉशरूम की सफ़ाई और ऊपरी पानी की टंकी साफ़ करने का अनुभव।',
  'worker-manoj-kumar': 'दादर में आवासीय पुनर्विकास के दौरान वरिष्ठ सिविल ठेकेदारों की सहायता, मलबे के बैग हटाने और कंक्रीट मिश्रण तैयार करने का अनुभव।',
  'worker-deepak-gupta': 'नेरुल और सीवुड्स में 20 से अधिक फ़्लैटों में विट्रिफ़ाइड फ़्लोरिंग और ग्रेनाइट प्लेटफ़ॉर्म की ढलाई का अनुभव।'
};

const primaryAbout: Record<string, string> = {
  ramesh: '8 साल के अनुभव वाले इलेक्ट्रीशियन। सुरक्षित और भरोसेमंद काम करना और समय पर पहुँचना मेरी प्राथमिकता है।',
  'worker-suresh-sharma': 'लीक-प्रूफ़ बाथरूम फिटिंग और पाइपलाइन की आपात मरम्मत में विशेषज्ञ प्लंबर। पाइप काटने के बाद जगह साफ़ रखता हूँ।',
  'worker-rajesh-vishwakarma': 'मॉड्यूलर किचन और बारीक इंटीरियर लकड़ी के काम में 10 साल के अनुभव वाला अनुभवी बढ़ई।',
  'worker-anil-chauhan': 'साफ़ किनारों, चिकनी पुट्टी और फ़र्श पर बिना रंग गिराए काम करने वाला पेशेवर पेंटर।',
  'worker-ganesh-yadav': 'सीधी ईंट की चिनाई, सैंड-फ़ेस प्लास्टर और कॉपिंग स्टोन के काम में अनुभवी राजमिस्त्री।',
  'worker-vikram-shinde': 'भारी आर्क वेल्डिंग, बालकनी ग्रिल मज़बूत करने और स्लाइडिंग गेट की मरम्मत में कुशल फ़ैब्रिकेशन वेल्डर।',
  'worker-sunita-devi': 'गहरी सफ़ाई, मशीन से फ़र्श साफ़ करने और टाइलों को सुरक्षित रखने वाली स्वच्छता पेशेवर।',
  'worker-manoj-kumar': 'सुरक्षा उपकरण, भारी सामग्री संभालने और राजमिस्त्री टीम की सहायता का अनुभव रखने वाला मेहनती निर्माण श्रमिक।',
  'worker-deepak-gupta': 'लेज़र लेवलिंग, टाइल स्पेसर और एपॉक्सी ग्राउटिंग में कुशल टाइल मिस्त्री।'
};

export function workerNameForLanguage(name: string, language: AppLanguage): string {
  if (language !== 'hi') return name;
  return name.replace(/[A-Za-z]+/g, word => nameWords[word] || word);
}

export function workerTradeForLanguage(trade: string, language: AppLanguage): string {
  return translateUiText(trade, language);
}

export function workerExperienceForLanguage(experience: string, language: AppLanguage): string {
  if (language !== 'hi') return experience;
  return experience.replace(/\byears?\b/gi, 'वर्ष').replace(/\bmonths?\b/gi, 'महीने');
}

export function workerAreaForLanguage(area: string, language: AppLanguage): string {
  if (language !== 'hi') return area;
  return area.split(', ').map(part => {
    const sector = part.match(/^(.*?)(?:\s+Sector\s+(\d+))$/i);
    if (sector) return `${localityWords[sector[1]] || sector[1]} सेक्टर ${sector[2]}`;
    return localityWords[part] || part;
  }).join(', ');
}

export function workerSkillForLanguage(skill: string, language: AppLanguage): string {
  if (language !== 'hi') return skill;
  return specialSkills[skill] || translateUiText(skill, language);
}

function generatedExperienceSummary(worker: Worker): string | null {
  const match = worker.workExperience.match(/^Experienced in (.+) for flats, offices, and commercial sites in (.+)\. Owns standard trade tools\.$/);
  if (!match) return null;
  const skills = match[1].split(', ').map(skill => workerSkillForLanguage(skill, 'hi')).join(', ');
  const area = workerAreaForLanguage(match[2], 'hi');
  return `फ़्लैट, कार्यालय और व्यावसायिक जगहों पर ${skills} का अनुभव। काम के सामान्य औज़ार उपलब्ध हैं। इलाका: ${area}।`;
}

export function workerWorkExperienceForLanguage(worker: Worker, language: AppLanguage): string {
  if (language !== 'hi') return worker.workExperience || worker.sample || '';
  return primaryWorkExperience[worker.id]
    || generatedExperienceSummary(worker)
    || translateUiText(worker.workExperience || worker.sample || '', language);
}

function generatedAboutSummary(worker: Worker): string | null {
  const trade = workerTradeForLanguage(worker.trade, 'hi');
  const experience = workerExperienceForLanguage(worker.experience, 'hi');
  const match = worker.aboutMe.match(/^.+ with \d+ years? of practical site experience\. Punctual, honest, and dedicated to clean work\.$/);
  if (match) return `${experience} के व्यावहारिक अनुभव वाले ${trade}। समय के पाबंद, ईमानदार और साफ़-सुथरे काम के लिए समर्पित।`;
  return null;
}

export function workerAboutForLanguage(worker: Worker, language: AppLanguage): string {
  if (language !== 'hi') return worker.aboutMe || worker.intro || '';
  return primaryAbout[worker.id]
    || generatedAboutSummary(worker)
    || translateUiText(worker.aboutMe || worker.intro || '', language);
}
