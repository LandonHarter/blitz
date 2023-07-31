'use client'

import { useEffect, useState } from "react";
import ClientClassicGame from "./classic/game";
import { usePathname } from "next/navigation";
import { GameType } from "@/backend/live/game";
import { getGameType } from "./client";

export default function LiveGamePage() {
    const id = usePathname().split('/')[2];
    const [gameType, setGameType] = useState<GameType>(GameType.None);

    const getClientUI = () => {
        if (gameType === GameType.Classic) {
            return <ClientClassicGame />
        }

        return <></>
    }

    useEffect(() => {
        getGameType(id).then((type: GameType) => {
            setGameType(type);
        });
    }, []);

    return getClientUI();
}