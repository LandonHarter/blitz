import { useMemo, useState } from 'react';

export default function useHover() {    
    const [hovered, setHovered] = useState(false);

    const eventHandlers = useMemo(() => ({
        onMouseOver() {
            setHovered(true);
        },
        onMouseOut() {
            setHovered(false);
        }
    }), []);

    return { hovered, eventHandlers };
}