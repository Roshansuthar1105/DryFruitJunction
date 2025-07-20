const teamMembers = [
    {
        name: "Roshan Suthar",
        role: "Tech Lead",
        image: "https://roshansuthar.netlify.app/Sources/profile-img.png",
        department: "Tech Team",
        github: "https://github.com/roshansuthar1105",
        linkedin: "https://linkedin.com/in/roshansuthar",
        email: "mailto:roshansuthar2023@gmail.com"
    },
    {
        name: "Himanshu Gahlot",
        role: "Unit tester",
        image: "/team/aanya.jpg",
        department: "Tech Team",
        github: "https://github.com/aanya-patel",
        linkedin: "https://linkedin.com/in/himanshugahlot",
        email: "mailto:himanshugahlot248@example.com"
    },
    {
        name: "Raj Mehta",
        role: "Marketing Head",
        image: "/team/raj.jpg",
        department: "Marketing",
    },
    {
        name: "Sonal Shah",
        role: "Customer Support",
        image: "/team/sonal.jpg",
        department: "Support",
    },
];

export default function OurTeam() {
    return (
        <section className="min-h-screen py-20 bg-gradient-to-br from-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Meet <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">Our Team</span>
                    </h2>
                    <p className="text-gray-600 mt-2">The hearts behind the sweets</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="rounded-xl overflow-hidden shadow-lg bg-white p-4 flex flex-col items-center text-center"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-40 h-40 object-cover rounded-full mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                            <span className="text-xs mt-1 bg-pink-100 text-pink-800 rounded-full px-3 py-1">{member.department}</span>
                            {member.contacts && (
                                <div className="flex gap-4 mt-4">
                                    <a href={member.contacts.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                        <svg className="w-5 h-5 fill-gray-700 hover:fill-pink-600" viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.8-1.6-3.8-1.6-.5-1.3-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.3-1.1.5-1.4-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.1-3.2 0-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.9-.3 1.9-.5 2.9-.5s2 .2 2.9.5c2-.1 2.9-1.1 2.9-1.1.6 1.5.1 2.6.1 2.9.7.9 1.1 1.9 1.1 3.2 0 4.4-2.7 5.4-5.3 5.7.4.4.6.9.6 1.9v2.9c0 .4.2.7.8.6 4.5-1.5 7.8-5.8 7.8-10.9C23.5 5.7 18.3.5 12 .5z" /></svg>
                                    </a>
                                    <a href={member.contacts.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                        <svg className="w-5 h-5 fill-gray-700 hover:fill-pink-600" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.6v2.2h.1c.5-1 1.6-2.2 3.4-2.2 3.7 0 4.4 2.4 4.4 5.4V24h-4v-7.6c0-1.8-.03-4.2-2.7-4.2-2.7 0-3.1 2-3.1 4.1V24h-4V8z" /></svg>
                                    </a>
                                    <a href={member.contacts.email} aria-label="Email">
                                        <svg className="w-5 h-5 fill-gray-700 hover:fill-pink-600" viewBox="0 0 24 24"><path d="M12 13.5l11.9-9H.1l11.9 9zm0 2.1L.1 5.1V21h23.8V5.1L12 15.6z" /></svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}