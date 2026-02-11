# Phoenix-311

Executive Summary -
The Phoenix 311 Chatbot, built for the City of Phoenix by the ASU/AWS Cloud Innovation Center, was created using just two AWS services. The majority of the chatbot creation was completed in AWS Lex, a service used to create a conversational interface with voice and text entry. A total of 69 intents were created, in both English and Spanish, to handle three main city processes, water services, trash services, and city payments. Six of these intents, three in English and three in Spanish, required information to be sent to, and received from, an external mapping site provided by the City. Due to the fact that the City of Phoenix lacked an internal API, headless chrome and AWS Lambda, were utilized to run specific code automatically, in response to events that required an address to be entered. Headless chrome was utilized to scrape information from the maps site using an entered address and then would return the corresponding information in response to the user. All AWS Lex and Lambda code was exported into JSON files.

To read the lucid chart a.k.a the architectural diagrams for this follow this link https://lucid.app/folder/invitations/accept/08ad09aa-11d1-4901-bdae-d83dafdde17d

## Disclaimers
Customers are responsible for making their own independent assessment of the information in this document.

This document:

(a) is for informational purposes only,

(b) references AWS product offerings and practices, which are subject to change without notice,

(c) does not create any commitments or assurances from AWS and its affiliates, suppliers or licensors. AWS products or services are provided "as is" without warranties, representations, or conditions of any kind, whether express or implied. The responsibilities and liabilities of AWS to its customers are controlled by AWS agreements, and this document is not part of, nor does it modify, any agreement between AWS and its customers, and

(d) is not to be considered a recommendation or viewpoint of AWS.

Additionally, you are solely responsible for testing, security and optimizing all code and assets on GitHub repo, and all such code and assets should be considered:

(a) as-is and without warranties or representations of any kind,

(b) not suitable for production environments, or on production or other critical data, and

(c) to include shortcuts in order to support rapid prototyping such as, but not limited to, relaxed authentication and authorization and a lack of strict adherence to security best practices.

All work produced is open source. More information can be found in the GitHub repo.
