export default function Page() {
    return <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2">
            <h2 className="pt-5 text-3xl font-semibold text-orange-700 text-center">Our commitment to food safety:</h2>
            <p className="text-center">We at Club Cooking strive to create a safe, clean, and fun environment for preparing and serving food!</p>
            <ul className="text-center">
                <li>
                    <h3 className="pt-5 text-xl font-semibold text-blue-700 text-center">Keeping our space clean!</h3>
                    <p>We thoroughly clean all dishes, surfaces, and ingredients (if needed) to ensure our cooking space is a healthy one! </p>
                </li>
                <li>
                    <h3 className="pt-5 text-xl font-semibold text-blue-700 text-center">Keeping our space clean!</h3>
                    <p>We always make sure to keep raw and cooked foods apart from each other when cooking!</p>
                </li>
                <li>
                    <h3 className="pt-5 text-xl font-semibold text-blue-700 text-center">Washing All Produce!</h3>
                    <p>All fruits and vegetables are washed before preparation to ensure they are safe and ready for use!</p>
                </li>
                <li>
                    <h3 className="pt-5 text-xl font-semibold text-blue-700 text-center">Monitoring Food Temperature!</h3>
                    <p>We at Club Cooking adhere to proper cooking, cooling, and refrigeration standards to ensure that all foods are kept at a safe temperature while being either prepared or stored!</p>
                </li>
            </ul>    
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