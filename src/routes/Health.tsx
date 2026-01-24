import type React from "react";

function T({ children }: { children: React.ReactNode }) {
    return <p><b>{children}</b></p>
}

export default function Page() {
    return <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-col gap-2">
            <h2 className="pt-5 text-3xl font-semibold text-orange-700 text-center">Our commitment to high standards:</h2>
            <p className="text-center">
                We take every step to ensure a safe, clean, and high-quality environment for preparing and serving food. 
            </p>
            <div className="bg-white rounded-md shadow-md p-7 w-full">   
                <p><u>Our practices include:</u></p>
                <T>Maintaining a clean space</T>
                <p>
                    We thoroughly clean and sanitize all tables, dishes, utensils, and food-contact surfaces to uphold strict hygiene standards.
                </p>
                <T>Preventing Cross-Contamination</T>
                <p> Ingredients and tools that could introduce contaminants are carefully separated. We follow strict protocols to keep raw and cooked foods apart at all times.</p>
                <T>Washing All Produce</T>
                <p>All fruits and vegetables are washed thoroughly before preparation to ensure they are safe and ready for use.</p>
                <T>Using Dedicated Equipment</T>
                <p> Different equipment is assigned for specific types of food—for example, separate tools for handling raw and cooked ingredients—to prevent cross-handling and contamination.</p>
                <T>Monitoring Food Temperature</T>
                <p> We adhere to proper cooking, cooling, and refrigeration standards to ensure all foods are kept at safe temperatures from preparation to storage.</p>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <h2 className="pt-5 text-3xl font-semibold text-orange-700 text-center">Allergen awareness:</h2>
            <p className="text-center">
                We take allergens seriously. Our team tracks when allergens are used and clearly identifies them in current and past recipes. Previous recipes and their associated allergens are kept as examples for reference to help us maintain transparency and safety for all members.
            </p>
        </div>
        <div className="flex flex-col gap-2">
            <h2 className="pt-5 text-3xl font-semibold text-orange-700 text-center">Our website:</h2>
            <p className="text-center">
                Club Cooking makes a strong effort to label allergens for every event in this website. However, presence or absence of an allergen label does not promise presence or absence of any allergen type. Feel free to ask questions about ingredients at any time!
            </p>
        </div>
        <p className="mt-4 text-center">
            <b>
                If you have any questions, feel free to email us at <u><a className="text-blue-600" href="mailto:cooking@wm.edu">cooking@wm.edu</a></u>. 
                We'd love to hear your feedback and concerns.
            </b>
        </p>
    </div>
}