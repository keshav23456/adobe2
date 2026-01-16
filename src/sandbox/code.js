import addOnSandboxSdk from "add-on-sdk-document-sandbox";

const { runtime } = addOnSandboxSdk.instance;

function start() {
    const sandboxApi = {
        // Returns pre-configured demo content for reliable testing
        extractDocument: () => {
            console.log("🎬 Using demo content for reliable Canvas demonstration");
            
            return {
                title: "The Role of Technology in Modern Life",
                content: "Technology has revolutionized modern life across multiple domains",
                structure: {
                    sections: [
                        {
                            id: "section-1",
                            title: "Transformation of Communication",
                            content: "Technology has completely changed the way people communicate with each other. Messages, emails, and video calls allow instant interaction across the world, reducing distance and time barriers. Social media platforms help individuals share ideas, opinions, and experiences, creating a more connected global society."
                        },
                        {
                            id: "section-2",
                            title: "Impact on Education",
                            content: "In the field of education, technology has made learning more flexible and accessible. Online classes, digital libraries, and educational apps enable students to study anytime and anywhere. Interactive tools and multimedia content also improve understanding and engagement."
                        },
                        {
                            id: "section-3",
                            title: "Influence on Business and Work",
                            content: "Businesses heavily depend on technology to increase efficiency and productivity. Automation, data analysis, and cloud-based systems help organizations manage operations smoothly. Remote work has also become possible due to advanced communication and collaboration tools."
                        },
                        {
                            id: "section-4",
                            title: "Challenges and Future Outlook",
                            content: "Despite its benefits, technology presents challenges such as privacy risks, cyber threats, and excessive screen time. However, with responsible use and proper regulations, technology can continue to support innovation and sustainable growth. It holds the potential to solve complex problems and shape a smarter, more efficient future."
                        }
                    ]
                }
            };
        }
    };

    runtime.exposeApi(sandboxApi);
}

start();
