export const WelcomeTemplate = (name: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
    
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>
    
    <body>
        Hello ${name},<br /><br />
    
        We are so excited that you have joined Blitz, the website that offers a bunch of tools that can help with studying
        and in classroom
        activities. We are thrilled to have you as a part of our community! 🎉 <br /><br />
    
        As a Blitz user, you can access features such as:<br />
    
        - Flashcards: Create and review flashcards to memorize facts and concepts. 📚<br />
        - Quizzes: Test your knowledge with quizzes on various subjects and topics. 📝<br /><br />
    
        To get started, please log in to your account and explore all the tools that Blitz has to offer. If you have any
        questions or feedback, please feel free to contact us at landonharter@outlook.com.<br /><br />
    
        We hope you enjoy using Blitz and find it useful for your learning goals.<br /><br />
    
        Sincerely,<br />
        The Blitz Team
    </body>
    
    </html>`;
};

export const AcceptedTeacherTemplate = (name: string, uid: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
    
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>

    <body>
        Hello ${name},<br /><br />
    
        We are so excited to inform you that you have been accepted as a verified teacher! 🎉 <br /><br />
        
        <a href="https://blitzedu.vercel.app/profile/${uid}" target="_blank">See your badge!</a><br /><br />
    
        Sincerely,<br />
        The Blitz Team
    </body>
    
    </html>`;
};

export const RejectedTeacherTemplate = (name: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
    
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>

    <body>
        Hello ${name},<br /><br />
    
        Unfortunately, we were unable to accept you into our teacher program. We are sorry for the inconvenience. <br /><br />

        Sincerely,<br />
        The Blitz Team
    </body>
    
    </html>`;
};