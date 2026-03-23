<?php

use CyberWolfStudio\Lingua\TranslationPayload;
use Illuminate\Support\Facades\File;

uses(Tests\TestCase::class);

beforeEach(function () {
    // Create test JSON locale file
    $jsonContent = json_encode([
        'welcome' => 'Welcome',
        'hello' => 'Hello',
        'nested' => [
            'key' => 'Nested value'
        ]
    ]);
    
    File::put(lang_path('en.json'), $jsonContent);
});

afterEach(function () {
    // Clean up test files
    File::delete(lang_path('en.json'));
    File::deleteDirectory(lang_path('en'));
    File::delete(lang_path('fr.json'));
});

test('it can compile json locale file', function () {
    $translations = TranslationPayload::compile(['en']);

    expect($translations)
        ->toHaveKey('en')
        ->and($translations['en'])
        ->toHaveKey('json')
        ->toHaveKey('php');

    // Check JSON translations
    $jsonTranslations = $translations['en']['json'];

    expect($jsonTranslations)
        ->toHaveKey('welcome', 'Welcome')
        ->toHaveKey('hello', 'Hello')
        ->toHaveKey('nested.key', 'Nested value');

    // PHP translations should be empty since we only created a JSON file
    expect($translations['en']['php'])->toBeEmpty();
});

test('it can compile php locale file', function () {
    File::makeDirectory(lang_path('en'), 0777, true, true);
    File::put(lang_path('en/auth.php'), "<?php\n\nreturn ['login' => 'Log in', 'logout' => 'Log out'];");

    $translations = TranslationPayload::compile(['en']);

    expect($translations['en']['php']['auth']['login'])->toBe('Log in');
});

test('it returns empty arrays for a non-existent locale', function () {
    $translations = TranslationPayload::compile(['zz']);

    expect($translations['zz']['php'])->toBeEmpty();
    expect($translations['zz']['json'])->toBeEmpty();
});

test('it can compile multiple locales at once', function () {
    File::put(lang_path('fr.json'), json_encode(['bonjour' => 'Bonjour']));

    $translations = TranslationPayload::compile(['en', 'fr']);

    expect($translations['en']['json'])->toHaveKey('welcome', 'Welcome');
    expect($translations['fr']['json'])->toHaveKey('bonjour', 'Bonjour');
});

test('it compiles both php and json for the same locale', function () {
    File::makeDirectory(lang_path('en'), 0777, true, true);
    File::put(lang_path('en/auth.php'), "<?php\n\nreturn ['login' => 'Log in', 'logout' => 'Log out'];");

    $translations = TranslationPayload::compile(['en']);

    expect($translations['en']['php'])->toHaveKey('auth');
    expect($translations['en']['json'])->toHaveKey('welcome', 'Welcome');
});