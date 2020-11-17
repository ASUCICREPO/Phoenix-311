# Phoenix-311


To read the lucid chart a.k.a the architectural diagrams for this follow this link https://lucid.app/folder/invitations/accept/08ad09aa-11d1-4901-bdae-d83dafdde17d

Executive Summary -
The Phoenix 311 Chatbot, built for the City of Phoenix by the ASU/AWS Cloud Innovation Center, was created using just two AWS services. The majority of the chatbot creation was completed in AWS Lex, a service used to create a conversational interface with voice and text entry. A total of 69 intents were created, in both English and Spanish, to handle three main city processes, water services, trash services, and city payments. Six of these intents, three in English and three in Spanish, required information to be sent to, and received from, an external mapping site provided by the City. Due to the fact that the City of Phoenix lacked an internal API, headless chrome and AWS Lambda, were utilized to run specific code automatically, in response to events that required an address to be entered. Headless chrome was utilized to scrape information from the maps site using an entered address and then would return the corresponding information in response to the user. All AWS Lex and Lambda code was exported into JSON files.
