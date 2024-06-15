

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';

test('renders WeatherWidget component', () => {
    render(<WeatherWidget />);
    const inputElement = screen.getByPlaceholderText(/enter city name/i);
    expect(inputElement).toBeInTheDocument();
});

test('fetches and displays weather data', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ name: 'London', main: { temp: 15, humidity: 80 }, weather: [{ description: 'clear sky' }] }),
        })
    );

    render(<WeatherWidget />);
    fireEvent.change(screen.getByPlaceholderText(/enter city name/i), { target: { value: 'London' } });
    fireEvent.click(screen.getByText(/get weather/i));

    await waitFor(() => {
        expect(screen.getByText(/Temperature: 15°C/)).toBeInTheDocument();
        expect(screen.getByText(/Humidity: 80%/)).toBeInTheDocument();
        expect(screen.getByText(/Description: clear sky/)).toBeInTheDocument();
    });
});
