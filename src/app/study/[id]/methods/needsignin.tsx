export default function RequireSignInStudyMethod() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100%',
            marginTop: 100
        }}>
            <h1 style={{
                fontSize: 60,
                fontWeight: 700,
                color: 'var(--text-color)',
                textAlign: 'center',
                width: '80%',
                maxWidth: 800,
                fontFamily: 'SF Pro Display'
            }}>To access this study method, you must sign in!</h1>
        </div>
    );
}