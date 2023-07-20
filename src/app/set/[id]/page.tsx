import { Metadata } from "next";
import SetContent from "./set";

export const metadata: Metadata = {
    title: 'Set • Blitz',
    description: 'A set of questions to study.',

};

export default function SetPage() {
    return (
        <>
            <SetContent />
        </>
    );
}