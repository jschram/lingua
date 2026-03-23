import React from 'react';
import { render, screen } from '@testing-library/react';
import { LinguaProvider, useLingua } from './index.jsx';

const mockLinguaData = {
  translations: {
    en: {
      php: {
          'hello': 'Hello :name!',
          'welcome': 'Welcome',
          'sidebar': {
            'dashboard': 'Dashboard',
            'reservations': 'Reservations',
            'activities': 'Activities',
            'settings': 'Settings',
            'logout': 'Logout',
          }
      },
      json: { 'plural_test': 'apple|apples', 'plural_test_replace': 'one :item|many :items' }
    },
    es: {
      php: { 'hello': 'Hola :name!', 'welcome': 'Bienvenido'},
      json: { 'plural_test': 'manzana|manzanas' }
    },
  },
};

// TestComponent.js (helper for testing)
const TestComponent = ({ translationKey, replace, choiceKey, choiceCount, choiceReplacements }) => {
  const { trans, transChoice, locale } = useLingua();
  return (
    <div>
      <p data-testid="locale">{locale}</p>
      {translationKey && <p data-testid="trans">{trans(translationKey, replace)}</p>}
      {choiceKey && <p data-testid="transChoice">{transChoice(choiceKey, choiceCount, choiceReplacements)}</p>}
    </div>
  );
};

const TestComponentWithAlias = ({ translationKey }) => {
  const { __ } = useLingua();
  return <p data-testid="alias">{__(translationKey)}</p>;
};

const ComponentOutsideProvider = () => {
  useLingua();
  return null;
};

describe('React Lingua Bindings', () => {
  test('trans function correctly translates a simple key', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent translationKey="welcome" />
      </LinguaProvider>
    );
    expect(screen.getByTestId('trans').textContent).toBe('Welcome');
  });

  test('trans function correctly translates a key with nested structure', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent translationKey="sidebar.dashboard" />
      </LinguaProvider>
    );
    expect(screen.getByTestId('trans').textContent).toBe('Dashboard');
  });

  test('trans function correctly replaces placeholders', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent translationKey="hello" replace={{ name: "React User" }} />
      </LinguaProvider>
    );
    expect(screen.getByTestId('trans').textContent).toBe('Hello React User!');
  });

  test('transChoice function correctly handles singular form', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent choiceKey="plural_test" choiceCount={1} />
      </LinguaProvider>
    );
    expect(screen.getByTestId('transChoice').textContent).toBe('apple');
  });

  test('transChoice function correctly handles plural form', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent choiceKey="plural_test" choiceCount={5} />
      </LinguaProvider>
    );
    expect(screen.getByTestId('transChoice').textContent).toBe('apples');
  });

  test('transChoice function correctly replaces placeholders and handles plural form', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent choiceKey="plural_test_replace" choiceCount={5} choiceReplacements={{ item: 'test_item' }} />
      </LinguaProvider>
    );
    expect(screen.getByTestId('transChoice').textContent).toBe('many test_items');
  });


  test('locale is correctly passed down and accessible via useLingua', () => {
    render(
      <LinguaProvider locale="es" Lingua={mockLinguaData}>
        <TestComponent />
      </LinguaProvider>
    );
    expect(screen.getByTestId('locale').textContent).toBe('es');
  });

  test('changing the locale prop on LinguaProvider updates the translations', () => {
    const { rerender } = render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent translationKey="welcome" />
      </LinguaProvider>
    );
    expect(screen.getByTestId('trans').textContent).toBe('Welcome');

    rerender(
      <LinguaProvider locale="es" Lingua={mockLinguaData}>
        <TestComponent translationKey="welcome" />
      </LinguaProvider>
    );
    expect(screen.getByTestId('trans').textContent).toBe('Bienvenido');
    expect(screen.getByTestId('locale').textContent).toBe('es');
  });

  test('trans function returns key if translation is missing', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent translationKey="missing_key" />
      </LinguaProvider>
    );
    expect(screen.getByTestId('trans').textContent).toBe('missing_key');
  });

  test('transChoice function returns key if translation is missing for pluralization', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponent choiceKey="missing_plural_key" choiceCount={5} />
      </LinguaProvider>
    );
    expect(screen.getByTestId('transChoice').textContent).toBe('missing_plural_key');
  });

  test('__ is an alias for trans', () => {
    render(
      <LinguaProvider locale="en" Lingua={mockLinguaData}>
        <TestComponentWithAlias translationKey="welcome" />
      </LinguaProvider>
    );
    expect(screen.getByTestId('alias').textContent).toBe('Welcome');
  });

  test('useLingua throws when used outside LinguaProvider', () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      expect(() => render(<ComponentOutsideProvider />)).toThrow('useLingua must be used within a LinguaProvider');
    } finally {
      console.error = originalError;
    }
  });
});
