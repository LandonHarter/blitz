import { Metadata } from "next";
import SetContent from "./set";

export const metadata: Metadata = {
    title: 'Set • Blitz',
    description: 'A set of questions to study.',

};

export default function SetPage() {
    return (
        <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@blitz_studio" />
            <meta name="twitter:title" content="Set • Blitz" />
            <meta name="twitter:description" content="A set of questions to study." />
            <meta name="twitter:image" content="https://www.rd.com/wp-content/uploads/2016/01/04-dog-breeds-dalmation.jpg" />

            <SetContent />
        </>
    );
}