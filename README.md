# 🎉 Fun Stuff - Interactive Experiences

A collection of weird and wonderful interactive experiences inspired by [neal.fun](https://neal.fun).

## 🎮 All Games & Experiences

### Original Experiences

#### 🏓 Bounce
Click on the canvas to create bouncing balls. Adjust gravity with the slider to see how they behave.

#### 🎨 Draw
Free-form drawing tool with customizable colors and brush sizes.

#### 🖌️ Paint With Particles
Move your mouse to create a trail of colorful particles that fade away.

#### 🎵 Music
Play music using your keyboard or by clicking on the piano keys. Use QWERTY keys to play different notes.

#### 🌍 Gravity
Move your mouse around to attract particles with gravity. Watch as they get pulled toward your cursor.

#### 🌀 Mandelbrot Set
Explore the beautiful Mandelbrot fractal. Click to zoom in and discover infinite complexity.

### Classic Games

#### 🐦 Flappy Bird
The classic tap game with a twist! Click or press SPACE to flap and avoid the pipes.

#### 🐍 Snake
The legendary snake game! Use arrow keys to move and eat the food to grow. Don't hit the walls or yourself!

#### 🧱 Breakout
Smash bricks with the ball! Move your paddle with the mouse to keep the ball bouncing and destroy all the bricks.

#### 🏸 Pong
The classic two-player game! Player 1 uses W/S keys, Player 2 uses Arrow Up/Down keys.

### 🎂 Anniversary (July 25)
On the one-year anniversary (July 25), a special celebration game unlocks with fireworks, confetti, and particles!

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Noaho600/fun-website.git
cd fun-website
```

2. Open `index.html` in your web browser.

That's it! No build process or dependencies needed.

## Usage

Just open the website and click on any experience card to get started. Each experience has its own controls and instructions.

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with gradients, animations, and responsive design
- **Vanilla JavaScript** - All interactions, games, and animations
- **Canvas API** - Graphics rendering for all games and experiences
- **Web Audio API** - Sound generation for the music player

## Browser Support

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- Web Audio API (for music feature)

## Customization

Feel free to:
- Change colors in `styles.css` by modifying the CSS custom properties in the `:root` selector
- Add new experiences by creating new functions and adding cards to the main page
- Adjust game difficulty, speeds, and sizes in `script.js`
- Modify the anniversary date by changing the check in `index.html` (currently July 25)

## Anniversary Feature

The website automatically displays a special anniversary badge and unlocks a celebration game on **July 25th** every year! This can be changed by modifying the date check in `index.html`:

```javascript
if (today.getMonth() === 6 && today.getDate() === 25) {
    // July 25 (month is 0-indexed)
}
```

## License

MIT License - feel free to use this for any purpose!

## Inspiration

Inspired by the amazing [neal.fun](https://neal.fun) website by Neal Agarwal.
