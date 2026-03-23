import { trans } from '../translator.js'
const Lingua = {
    translations: {
        en: {
            php: {
                dashboard: 'Dashboard',
                replace: 'Welcome, :user',
                multi: ':a and :b',
                settings: {
                    title: 'Settings',
                }
            },
            json: {
                'json_key': 'JSON Value',
                'json_replace': 'Hello :name from JSON',
            }
        },
        pl: {
            php: {
                dashboard: 'Panel',
                "Please enter your email address.": "Proszę podaj swój adres email.",
            }
        }
    }
}
const config = {
    Lingua: Lingua,
    locale: 'en'
}


test('trans is translating string', () => {
    expect(trans('dashboard', {}, false, config)).toBe('Dashboard')
});

test('trans is translating nested object', () => {
    expect(trans('settings.title', {}, false, config)).toBe('Settings')
});

test("trans is translating key containing dot character", () => {
    const configPl = {
        Lingua: Lingua,
        locale: "pl",
    };
    expect(trans("Please enter your email address.", {}, false, configPl)).toBe(
        "Proszę podaj swój adres email."
    );
});

test('trans is replacing key', () => {
    expect(trans('replace', { user: 'World' }, false, config)).toBe('Welcome, World')
})

test('trans returns the key when translation is missing', () => {
    expect(trans('nonexistent', {}, false, config)).toBe('nonexistent')
})

test('trans looks up json namespace when key not in php', () => {
    expect(trans('json_key', {}, false, config)).toBe('JSON Value')
})

test('trans supports replacements in json translations', () => {
    expect(trans('json_replace', { name: 'World' }, false, config)).toBe('Hello World from JSON')
})

test('trans handles multiple replacements', () => {
    expect(trans('multi', { a: 'foo', b: 'bar' }, false, config)).toBe('foo and bar')
});

// @deprecated This test does not make sense. Locale should be case sensitive. (can be en-US for example)
// test('trans is working with locale uppercase', () => {
//     const uppercaseConfig = {
//         Lingua: Lingua,
//         locale: "PL"
//     }
//     expect(trans('dashboard', {}, false, uppercaseConfig)).toBe('Panel')
// })
