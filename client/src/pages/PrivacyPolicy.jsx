const privacyList = [
    {
      title: "Information Collection",
      description: "We collect basic user details such as name, address, and contact information to fulfill your orders."
    },
    {
      title: "Data Protection",
      description: "All user data is securely encrypted and stored. It is not shared with third-party services without consent."
    },
    {
      title: "Cookie Usage",
      description: "We use cookies to enhance your browsing experience and improve site functionality."
    },
    {
      title: "User Rights",
      description: "You may request access, correction, or deletion of your personal data at any time by contacting support."
    }
  ];
export const PrivacyPolicy = () => (
    <section className="px-6 py-16 max-w-4xl mx-auto text-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <ul className="space-y-6">
        {privacyList.map((policy, idx) => (
          <li key={idx} className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-orange-700 mb-1">{policy.title}</h3>
            <p className="text-gray-700 text-sm">{policy.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );