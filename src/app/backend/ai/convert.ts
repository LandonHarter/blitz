import generateId from "../id";
import { Question, QuestionOption, QuestionType } from "../live/set";

export const parseAi = (response: string, numQuestions: number) => {
    try {
        const answers = response.split('Answers:')[1];
        const answersIndex: number[] = [];
        for (let i = 0; i < numQuestions; i++) {
            const letter = answers.split(`${i + 1}. (`)[1][0];
            switch (letter) {
                case 'a':
                    answersIndex.push(0);
                    break;
                case 'b':
                    answersIndex.push(1);
                    break;
                case 'c':
                    answersIndex.push(2);
                    break;
                case 'd':
                    answersIndex.push(3);
                    break;
                default:
                    answersIndex.push(-1);
                    break;
            }
        }

        const questions = response.split('Answers:')[0];
        const questionsArray: Question[] = [];
        for (let i = 0; i < numQuestions; i++) {
            const question = questions.split(`${i + 1}. `)[1].split('\n')[0];
            const options = questions.split(`${i + 1}. `)[1].split('\n');
            const optionsString = questions.split('\n').slice((i * 6) + 1, (i * 6) + 5).join('\n');
            const option1 = optionsString.split('(a) ')[1].split('\n')[0].replace('(a) ', '');
            const option2 = optionsString.split('(b) ')[1].split('\n')[0].replace('(b) ', '');
            const option3 = optionsString.split('(c) ')[1].split('\n')[0].replace('(c) ', '');
            const option4 = optionsString.split('(d) ')[1].split('\n')[0].replace('(d) ', '');
            const optionsArray: QuestionOption[] = [
                {
                    option: option1,
                    correct: answersIndex[i] === 0,
                    id: generateId(),
                    optionData: {}
                },
                {
                    option: option2,
                    correct: answersIndex[i] === 1,
                    id: generateId(),
                    optionData: {}
                },
                {
                    option: option3,
                    correct: answersIndex[i] === 2,
                    id: generateId(),
                    optionData: {}
                },
                {
                    option: option4,
                    correct: answersIndex[i] === 3,
                    id: generateId(),
                    optionData: {}
                }
            ];

            questionsArray.push({
                question: question,
                type: QuestionType.MultipleChoice,
                options: optionsArray,
                id: generateId()
            });
        }

        return {
            success: true,
            error: null,
            questions: questionsArray
        }
    } catch (e) {
        return {
            success: false,
            error: 'There was an error parsing the AI response',
            questions: null
        }
    }
};

export const parseWorksheet = (response: string, numQuestions: number) => {
    const questions: string[] = [];
    for (let i = 0; i < numQuestions; i++) {
        const startingIndex = response.indexOf(`${i + 1}. `);
        const endingIndex = response.indexOf(`${i + 2}. `);
        const question = response.slice(startingIndex, endingIndex);
        questions.push(question.slice(i >= 9 ? 4 : 3).replaceAll('\n', ' '));
    }

    return questions;
};