const termsList = [
    {
        title: "Freshness Guarantee",
        description: "All sweets are freshly prepared and dispatched within 24 hours of receiving the order."
    },
    {
        title: "Order Cancellation",
        description: "Orders once placed cannot be cancelled or refunded after the processing has begun."
    },
    {
        title: "Shipping Delays",
        description: "We are not liable for any delays caused by third-party delivery partners."
    },
    {
        title: "Allergen Notice",
        description: "Our sweets may contain allergens like milk, nuts, gluten, etc. Customers with allergies should exercise caution."
    },
    {
        title: "Shipping Accuracy",
        description: "Customers are responsible for providing accurate shipping and contact information."
    }
];
// Terms & Conditions Component
export const TermsAndConditions = () => (
    <section className="px-6 py-16 max-w-4xl mx-auto text-gray-800 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <ul className="space-y-6">
            {termsList.map((term, idx) => (
                <li key={idx} className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-700 mb-1">{term.title}</h3>
                    <p className="text-gray-700 text-sm">{term.description}</p>
                </li>
            ))}
        </ul>
    </section>
);