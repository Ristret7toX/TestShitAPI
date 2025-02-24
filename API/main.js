
async function sambanovaApi(request) {
    const apiKey = "3c09e53c-d579-4d8b-9f62-cf2a06f28ff7";
    const apiUrl = "https://api.sambanova.ai/v1/chat/completions";
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response from AI";
    } catch (error) {
        throw error;
    }
}

async function getSambanovaBody(jobInfo, lang) {
    return {
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
            {
                role: "system",
                content: `
                    You are an expert career coach and cover letter writer. Generate professional, personalized cover letters that effectively showcase candidates' qualifications.

                    Key Requirements:
                    1. Write content from cover letters
                    2. Use ${lang} as the primary language
                    3. Maintain a direct, clear writing style

                    Structure each letter with:

                    1. **Opening (25% of content)**
                    - Express genuine interest in the specific role
                    - Demonstrate knowledge of the company
                    - State your primary qualification

                    2. **Main Content (50% of content)**
                    - Connect relevant experience to job requirements
                    - Highlight specific achievements with metrics
                    - Show understanding of company needs
                    - Emphasize transferable skills

                    3. **Closing (25% of content)**
                    - Restate interest in the position
                    - Include clear call to action
                    - Express appreciation

                    **Writing Style Guidelines:**
                    - Use active voice
                    - Keep sentences concise and direct
                    - Focus on concrete examples over general statements
                    - Maintain professional tone while showing personality
                    - Avoid clichés and generic phrases
                    - Use industry-relevant keywords naturally

                    **Strict Format Requirements:**
                    - **Exactly 3 paragraphs** (no more, no less).
                    - **200 words total.**
                    - **Do NOT include** "Dear Hiring Manager," or any greeting.
                    - **Do NOT include** "Sincerely," or any closing signature.
                    - **Only return the content**—no extra formatting or placeholders.
                    - **Only include personal details if explicitly mentioned in the job listing**
                    - **Prevent hallucinations or fabrications**
                    - **Maintain a structured, professional writing style**
                `,
            },
            {
                role: "user",
                content: `
                Generate a cover letter for the following job and uses requirement that already said before and please Start Immediately with the content Do not add (Here is a cover letter tailored to the job requirements:, etc..):

                - **Job Title**: ${jobInfo.title}
                - **Company**: ${jobInfo.companyName}

                **Applicant Information:**
                - **Name**: [Your Name]
                - **Email**: [Your Email]
                - **Phone Number**: [Your Phone Number]
                - **Education**:
                - **University of Washington, WA** (Sep 2023 - Dec 2025)
                    - Master of Electrical and Computer Engineering (GPA: 3.7/4.0)
                    - Relevant coursework: Embedded System Programming (4.0), Algorithms (3.9), Object-Oriented Design (3.6)
                - **Thomas Edison State University, NJ** (Aug 2020 - June 2023)
                    - Bachelor of Computer Science (GPA: 3.9/4.0)
                    - Relevant coursework: Java Programming (4.0), Data Structures (3.9), Software Engineering (4.0)
                - **Technical Skills**:
                - **Programming**: Java, SpringCloud, TypeScript, JavaScript, C++, Kotlin, Python, MERN stack, React, Node.js, SQL
                - **Tech Stack**: Azure, MongoDB, Git, Tableau, Distributed Systems, AWS, CI/CD
                - **Work Experience**:
                - **Software Engineering Intern (Capstone) at Genmab (Jan 2024 - June 2024)**
                    - Developed a full-stack chatbot to support the transition to a new POD operating system, reducing HR and IT support requests by 60%.
                    - Designed a structured backend with Express.js and MongoDB, implementing a Logs Collection for real-time debugging and a POD Knowledge Base for custom content retrieval.
                    - Optimized chatbot responses using prompt engineering, improving user satisfaction by 100%.
                - **Software Engineering Intern at Trip.com (Sep 2019 - June 2020)**
                    - Developed and optimized landing pages, boosting conversion rates by 20% and reducing loading times.
                    - Automated deep-link generation for the marketing team, reducing manual work.
            - **Projects**:
            - **Cloud-Native Microservices Architecture with AWS and SpringCloud**
                - Developed a scalable microservices architecture integrating AWS services and SpringCloud.
                - Built backend microservices using SpringCloud and deployed the system with Kubernetes.
            - **Cyclist Master – Android Fitness Tracking App (Kotlin)**
                - Developed a GPS-enabled cycling tracker with real-time route recording using Google Maps API.
                - Implemented offline activity storage with Room Database.

            **Additional Guidelines:**  
            - Do **not** mention GPA unless explicitly required in the job description.  
            - **Start immediately** with the content.  
            - Do **not** include skills, experiences, or qualifications that I do not have.  
            - Please do not hallucinate something that I don't have; if I don't have it, then don't write it.
                `,
            },
        ],
    };
}

async function main(){
    jobInfo = {
        title: "Software Engineer Intern",
        companyName: `Appian`,
        location: `Naperville, IL, 60540`,
        desc: `Appian is a software company that provides digital transformation, low-code application development, and business process management. They are seeking Software Engineering interns who are passionate about solving technical challenges and want to be hands-on with fellow developers in a collaborative environment`,
    }
    const request = await getSambanovaBody(jobInfo, "English");
    let response = await sambanovaApi(request);
    console.log(response);
}

main();