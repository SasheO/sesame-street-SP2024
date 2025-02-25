import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path
dotenv_path = Path('../.env')
load_dotenv(dotenv_path=dotenv_path)

def sign_in_with_email_and_password(email, password, return_secure_token=True):
    payload = json.dumps({"email":email, "password":password, "return_secure_token":return_secure_token})
    FIREBASE_WEB_API_KEY = os.getenv("API_KEY")

    rest_api_url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"

    r = requests.post(rest_api_url,
                  params={"key": FIREBASE_WEB_API_KEY},
                  data=payload)

    return r.json()

test_user_email = "practitioner2.tester@gmail.com"
test_user_password = "12.3rdaskufq24eS"

user_credentials = sign_in_with_email_and_password(test_user_email, test_user_password)
test_data = {"title":"Local Herbs for Migraine",
             "created_at":"02-24-2025", 
             "tags":"herbal,migraine",
             "description": """I saw this here: https://drjeffsteinberg.com/herbal-allies-exploring-the-efficacy-of-botanical-remedies-for-migraine-relief/\n\nMigraines, characterized by intense, throbbing headaches often accompanied by nausea, vomiting, and sensitivity to light and sound, can be debilitating for those who suffer from them. While modern medicine offers various pharmaceutical options for migraine relief, many individuals seek alternative remedies due to concerns about side effects or a desire for more natural approaches. One such avenue of exploration is herbal remedies, which have been used for centuries in traditional medicine systems worldwide. In this article, we delve into the realm of herbal allies and explore their efficacy in providing relief from migraines.

Exploring Herbal Remedies for Migraine Relief
Understanding Migraines
Before delving into herbal remedies, it’s crucial to understand the underlying causes and triggers of migraines. Migraines are complex neurological disorders influenced by genetic, environmental, and lifestyle factors. Common triggers include stress, hormonal changes, certain foods, a lack of sleep, and sensory stimuli like bright lights or strong smells. Migraines involve the activation of pain pathways in the brain, along with changes in blood flow and neurotransmitter levels.

Herbal Allies for Migraine Relief
1. Fever few (Tanacetum parthenium): Fever few is perhaps one of the most well-known herbal remedies for migraines. It has been used traditionally to alleviate headaches and reduce the frequency and severity of migraine attacks. Fever few contains compounds called sesquicentennial lac-tones, which possess anti-inflammatory and vasodilatory properties. These actions may help to reduce the inflammation of blood vessels in the brain associated with migraines and alleviate pain. Some studies suggest that regular use of fever few may decrease the frequency of migraines in certain individuals.

2. Butterbur (Petasites hybridus): Butter bur is another herb that has garnered attention for its potential efficacy in migraine management. Like fever few, butter bur contains compounds with anti-inflammatory properties. Additionally, it may act as a calcium channel blocker, which could help to reduce spasms in blood vessels and prevent migraine attacks. Clinical trials have shown promising results, with some participants experiencing a significant reduction in the frequency and severity of migraines after taking butter bur supplements.

3. Ginger (Zingiber officinale): Ginger is renowned for its anti-nausea and anti-inflammatory properties, making it a popular remedy for various types of headaches, including migraines. It contains gingerol and other bio active compounds that inhibit the production of inflammatory substances in the body. Ginger also helps to alleviate nausea, which is a common symptom

experienced during migraine attacks. While more research is needed specifically on ginger’s effectiveness for migraines, many individuals find relief by consuming ginger tea or supplements during episodes.

4. Peppermint (Mentha piperita): Peppermint is another herbal ally that may offer relief from migraine symptoms. Its active component, menthol, possesses analgesic and muscle relaxant properties, which can help ease tension headaches often associated with migraines. Additionally, inhaling the aroma of peppermint oil may provide a cooling sensation that distracts from the pain and reduces sensitivity to light and sound. Peppermint oil can be diluted and applied topically to the temples or used in aromatherapy diffuses for inhalation.

5. Lavender (Lavandula angustifolia): Lavender is prized for its calming and stress-relieving properties, making it a valuable ally for migraine sufferers, as stress is a common trigger for attacks. Inhalation of lavender essential oil has been shown to reduce anxiety and promote relaxation, potentially mitigating the intensity of migraine symptoms. Additionally, lavender may have analgesic effects when applied topically, providing localized relief from headache pain. Incorporating lavender into self-care rituals, such as taking relaxing baths or practicing aromatherapy, may help to prevent migraines and manage their symptoms.

6. Valerian (Valeriana officinalis): Valerian is a herb traditionally used to promote sleep and alleviate anxiety, both of which can exacerbate migraine symptoms. By inducing relaxation and improving sleep quality, valerian may help to reduce the frequency and severity of migraines in susceptible individuals. Some research suggests that valerian may act on neurotransmitters like gamma-amicability acid (GABA) to exert its calming effects. While more studies are needed to confirm its efficacy specifically for migraines, Valerian’s potential as a natural remedy for headache relief is promising.

7. Willow Bark (Salix spp.): Willow bark has been used for centuries as a natural pain reliever due to its salicin content, which is similar to the active ingredient in aspirin. Salicin has anti-inflammatory and analgesic properties, making willow bark an effective remedy for various types of pain, including headaches and migraines. Some individuals find relief by brewing willow bark tea or taking standardized supplements. However, it’s essential to consult with a healthcare professional before using willow bark, especially for those with aspirin allergies or other medical conditions."""
             }


test_data['idToken'] = user_credentials['idToken']

response = requests.post("http://localhost:5000/post_forum", json=test_data)
try:
    print(response)
    print(response.json())
except Exception as e:
    print(1, e)