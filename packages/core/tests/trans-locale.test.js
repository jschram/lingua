import { trans } from '../translator.js'
const Lingua = {
    translations: {
        en: {
            php: {
                dashboard: 'Dashboard',
                replace: 'Welcome, :user',
            },
            json: {
                'json_greeting': 'Hello from JSON',
            }
        },
        ua: {
            php: {
                dashboard: 'Дашборд',
                replace: 'Привіт, :user',
            },
            json: {
                'json_greeting': 'Привіт з JSON',
            }
        }
    }
}

test('trans is translating en string', () => {
    expect(trans('dashboard', {}, false, {
        Lingua,
        locale: 'en'
    })).toBe('Dashboard')
});

test('trans is translating ua string', () => {
    expect(trans('dashboard', {}, false, {
        Lingua,
        locale: 'ua'
    })).toBe('Дашборд')
});

test('trans is translating en string with replace', () => {
    expect(trans('replace', {
        user: 'user'
    }, false, {
        Lingua,
        locale: 'en'
    })).toBe('Welcome, user')
});

test('trans is translating ua string with replace', () => {
    expect(trans('replace', {
        user: 'користувачу'
    }, false, {
        Lingua,
        locale: 'ua'
    })).toBe('Привіт, користувачу')
});

test('trans returns the key for a missing locale', () => {
    expect(trans('dashboard', {}, false, { Lingua, locale: 'de' })).toBe('dashboard')
});

test('trans looks up json translations for en locale', () => {
    expect(trans('json_greeting', {}, false, { Lingua, locale: 'en' })).toBe('Hello from JSON')
});

test('trans looks up json translations for ua locale', () => {
    expect(trans('json_greeting', {}, false, { Lingua, locale: 'ua' })).toBe('Привіт з JSON')
});
