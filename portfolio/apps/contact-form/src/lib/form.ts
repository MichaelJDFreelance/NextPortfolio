// app/actions.ts
'use server';

export async function submitContact(data: FormData) {
    const name = data.get('preference') as string;
    console.log('Form submitted:', name);

    // Example: save to database, call API, etc.
}