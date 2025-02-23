
// interface JobInfo{
//     title: string,
//     companyName: string,
//     location: string,
//     desc: string,
// }

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
                    Generate a cover letter for the following job:

                    - **Job Title**: ${jobInfo.title}
                    - **Company**: ${jobInfo.companyName}
                    - **Location**: ${jobInfo.location}
                    - **Job Description**: ${jobInfo.desc}

                    **Applicant Information:**
                    - **Name**: [name]
                    - **Email**: [email]
                    - **Phone Number**: [phone number]
                    - **Degree**: Bachelor's in Computer Science, Universitas Pembangunan Nasional 'Veteran' Jawa Timur (2023).
                    - **GPA**: 3.43
                    - **Technical Skills**: 
                      - **Software Development**: C++, Rust, JavaScript, TypeScript, SQL, HTML
                      - **Frameworks & Libraries**: ReactJS, Next.js, Qt, Tailwind CSS
                      - **Databases**: MySQL, SQLite, Prisma ORM, PostgreSQL
                      - **API & Web Scraping**: RESTful APIs, Web Scraping with Python (BeautifulSoup, Scrapy), Puppeteer, Selenium
                      - **Data Entry & Processing**: Microsoft Excel, Google Sheets, Data Cleaning, Data Validation, Database Management, Fast & Accurate Typing
                    - **Experience**: Software development (academic projects). (Literally no experience)
                    - **Notable Project**: Implementation of traceable ring signature in electronic voting blockchain-based app.
                    - **Holds a SIM C (motorcycle driving license)**
                    - **Proficient in speaking and writing English**

                    **Additional Guidelines:**  
                    - Do **not** mention my GPA, SIM C (motorcycle license), or English proficiency unless explicitly required in the job description.  
                    - **Start immediately** with the content
                    - Do **not** include skills, experiences, or qualifications that I do not have.
                    - Write the cover letter following the structure, style, and format guidelines mentioned earlier.
                    - Please do not hallucinate something that I don't have; if I don't have it, then don't write it.
                `,
            },
        ],
    };
}

async function main(){
    jobInfo = {
        title: "Software Engineer Intern",
        companyName: "Ticketmaster",
        location: `Reston, VA, USA`,
        desc: `Job Summary:

JOB DESCRIPTION – Intern, Software Engineering

Location: Reston, VA

Division: Ticketmaster

Line Manager: Manager Software

Contract Terms:  40 hours per week, Onsite

THE TEAM

The Archtics Roadrunners Team is comprised of talented software engineers that support one of Ticketmaster’s core ticketing platforms. The platform, Archtics, is the primary tool used by major sports leagues as well as major event venues across North American and International locations.

Our mission is to develop features that support the organic growth of Archtics clients, ensuring retention and exceeding market expectations. We develop code that scales well during heavy traffic, is fault-tolerant to minimize the impact to our fans and meets architectural standards. We strive to live by a team-driven culture that delivers quality business value to all our stakeholders.

THE JOB

The Intern, Software Engineer requires a good understanding of software engineering methodologies. As our newly hired Intern, Software Engineer, you will be involved in designing, coding and automated testing of high-volume software.

We believe in solving complex issues through collaboration and teamwork, so being a team player is a key characteristic that we look for in our interns.

WHAT YOU WILL BE DOING

Code high-volume software
Automate existing manual testing
Building systems that manage and process orders on the world’s leading Ticketing platform.
WHAT YOU NEED TO KNOW (or TECHNICAL SKILLS)

Pursuing BS/BA in Computer Science or related field
Some knowledge/experience in Java
Some knowledge/experience in at least one of the following: JavaScript, .NET, SQL, or Angular 2
High levels of creativity and quick problem-solving capabilities
Preferred: Demonstrated software engineering experience from previous internship, work experience, coding competitions, or publications
Position is on-site in our Reston, Virginia office
YOU (BEHAVIOURAL SKILLS)

Ownership. You feel ownership over everything you do. You'd never call code complete until you’re confident it’s correct
Passion. You are excited to learn and work on a modern tech stack and solve real world business problems
A team player. You believe that you can achieve more on a team—that the whole is greater than the sum of its parts. You rely on others' candid feedback for continuous improvement
Collaboration. Partner with a diverse group of professionals with different skills & disciplines across the organization to achieve a common goal
LIFE AT TICKETMASTER

We are proud to be a part of Live Nation Entertainment, the world’s largest live entertainment company.

Our vision at Ticketmaster is to connect people around the world to the live events they love. As the world’s largest ticket marketplace and the leading global provider of enterprise tools and services for the live entertainment business, we are uniquely positioned to successfully deliver on that vision. 

We do it all with an intense passion for Live and an inspiring and diverse culture driven by accessible leaders, attentive managers, and enthusiastic teams. If you’re passionate about live entertainment like we are, and you want to work at a company dedicated to helping millions of fans experience it, we want to hear from you.

Our work is guided by our values:

Reliability - We understand that fans and clients rely on us to power their live event experiences, and we rely on each other to make it happen.

Teamwork - We believe individual achievement pales in comparison to the level of success that can be achieved by a team

Integrity - We are committed to the highest moral and ethical standards on behalf of the countless partners and stakeholders we represent

Belonging - We are committed to building a culture in which all people can be their authentic selves, have an equal voice and opportunities to thrive

EQUAL EMPLOYMENT OPPORTUNITY

We are passionate and committed to our people and go beyond the rhetoric of diversity and inclusion.  You will be working in an inclusive environment and be encouraged to bring your whole self to work.  We will do all that we can to help you successfully balance your work and homelife.  As a growing business we will encourage you to develop your professional and personal aspirations, enjoy new experiences, and learn from the talented people you will be working with.  It’s talent that matters to us and we encourage applications from people irrespective of their gender, race, sexual orientation, religion, age, disability status or caring responsibilities.


Ticketmaster strongly supports equal employment opportunity for all applicants regardless of age (40 and over), ancestry, color, religious creed (including religious dress and grooming practices), family and medical care leave or the denial of family and medical care leave, mental or physical disability (including HIV and AIDS), marital status, domestic partner status, medical condition (including cancer and genetic characteristics), genetic information, military and veteran status, political affiliation, national origin (including language use restrictions), citizenship, race, sex (including pregnancy, childbirth, breastfeeding and medical conditions related to pregnancy, childbirth or breastfeeding), gender, gender identity, and gender expression, sexual orientation, or any other basis protected by applicable federal, state or local law, rule, ordinance or regulation. 

We will consider qualified applicants with criminal histories in a manner consistent with the requirements of the Los Angeles Fair Chance Ordinance, San Francisco Fair Chance Ordinance and the California Fair Chance Act and consistent with other similar and / or applicable laws in other areas.

We also afford equal employment opportunities to qualified individuals with a disability. For this reason, Ticketmaster will make reasonable accommodations for the known physical or mental limitations of an otherwise qualified individual with a disability who is an applicant consistent with its legal obligations to do so, including reasonable accommodations related to pregnancy in accordance with applicable local, state and / or federal law. As part of its commitment to make reasonable accommodations, Ticketmaster also wishes to participate in a timely, good faith, interactive process with a disabled applicant to determine effective reasonable accommodations, if any, which can be made in response to a request for accommodations. Applicants are invited to identify reasonable accommodations that can be made to assist them to perform the essential functions of the position they seek. Any applicant who requires an accommodation in order to perform the essential functions of the job should contact a Human Resources Representative to request the opportunity to participate in a timely interactive process.  Ticketmaster will also provide reasonable religious accommodations on a case-by-case basis.

HIRING PRACTICES
The preceding job description has been designed to indicate the general nature and level of work performed by employees within this classification. It is not designed to contain or be interpreted as a comprehensive inventory of all duties, responsibilities, and qualifications required of employees assigned to this job.

Ticketmaster recruitment policies are designed to place the most highly qualified persons available in a timely and efficient manner. Ticketmaster may pursue all avenues available, including promotion from within, employee referrals, outside advertising, employment agencies, internet recruiting, job fairs, college recruiting and search firms.`,
    }
    const request = await getSambanovaBody(jobInfo, "English");
    let response = await sambanovaApi(request);
    console.log(response);
}

main();