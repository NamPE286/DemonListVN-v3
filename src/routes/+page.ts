export async function load() {
    const greetings = ['Hello', 'Sup', 'Howdy', 'Hi', 'Hola', 'Greetings']

    return {
        greeting: greetings[Math.floor(Math.random() * greetings.length)]
    }
};