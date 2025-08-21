// Setup platforms and enemies for each level
function setupLevel(level, scene) {
    // Remove old platforms and enemies
    if (platforms) platforms.clear(true, true);
    if (enemies) enemies.clear(true, true);

    platforms = scene.physics.add.staticGroup();
    if (level === 1) {
        platforms.create(400, 584, 'ground').setScale(2).refreshBody();
        platforms.create(600, 450, 'ground');
        platforms.create(200, 350, 'ground');
        platforms.create(400, 220, 'ground');

        enemies = scene.physics.add.group();
        enemies.create(600, 400, 'enemy');
        enemies.create(200, 300, 'enemy');
        enemies.create(400, 180, 'enemy');
    } else if (level === 2) {
        platforms.create(400, 584, 'ground').setScale(2).refreshBody();
        platforms.create(700, 500, 'ground');
        platforms.create(100, 400, 'ground');
        platforms.create(300, 300, 'ground');
        platforms.create(600, 200, 'ground');

        enemies = scene.physics.add.group();
        enemies.create(700, 480, 'enemy');
        enemies.create(100, 380, 'enemy');
        enemies.create(600, 180, 'enemy');
        enemies.create(300, 280, 'enemy');
    }

    enemies.children.iterate(function(enemy) {
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1);
        enemy.setVelocityX(enemySpeed);
    });

    scene.physics.add.collider(playerContainer, platforms);
    scene.physics.add.collider(enemies, platforms);
    scene.physics.add.collider(playerContainer, enemies, hitPlayer, null, scene);
}
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let playerContainer;
let platforms;
let cursors;
let sword;
let arrows;
let lastArrowTime = 0;
let spaceKey;
let shiftKey;
let swordActive = false;
let swordTimer = 0;
let enemies;
let enemySpeed = 60;
let currentLevel = 1;

function preload() {
    // Placeholder assets
    this.load.image('background', 'https://dummyimage.com/800x600/7c6f4b/3a2f1b&text=Medieval+Background');
    this.load.image('ground', 'https://dummyimage.com/400x32/444/222&text=Platform');
    this.load.image('player', 'https://dummyimage.com/32x48/8b5c2b/fff&text=Knight');
    this.load.image('sword', 'https://dummyimage.com/40x10/fff/8b5c2b&text=Sword');
    this.load.image('arrow', 'https://dummyimage.com/32x8/fff/222&text=Arrow');
    this.load.image('enemy', 'https://dummyimage.com/32x48/ff4444/fff&text=Enemy');
}

function create() {
    this.add.image(400, 300, 'background');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 584, 'ground').setScale(2).refreshBody();
    platforms.create(600, 450, 'ground');
    platforms.create(200, 350, 'ground');
    platforms.create(400, 220, 'ground');

    // Create a container for the player with armor and helmet
    playerContainer = this.add.container(100, 450);

    // Body (armor): gray rectangle
    let body = this.add.rectangle(0, 0, 32, 48, 0x888888);
    // Helmet: dark gray ellipse
    let helmet = this.add.ellipse(0, -28, 32, 20, 0x444444);
    // Face: peach circle
    let face = this.add.circle(0, -18, 12, 0xffcc99);

    playerContainer.add([body, helmet, face]);

    // Enable physics for the container
    this.physics.world.enable(playerContainer);
    playerContainer.body.setCollideWorldBounds(true);
    playerContainer.body.setBounce(0.2);
    playerContainer.body.setGravityY(600);
    // Set body size to match graphics
    playerContainer.body.setSize(32, 48);
    playerContainer.body.setOffset(-16, -24);

    this.physics.add.collider(playerContainer, platforms);

    cursors = this.input.keyboard.createCursorKeys();
    sword = this.add.image(playerContainer.x, playerContainer.y, 'sword');
    sword.setVisible(false);
    arrows = this.physics.add.group();

        // Custom keys for sword and bow
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    setupLevel(currentLevel, this);

    // Input for sword and bow
    this.input.on('keydown-SPACE', () => {
        sword.setPosition(player.x + (player.flipX ? -30 : 30), player.y);
        sword.setFlipX(player.flipX);
        sword.setVisible(true);
        this.time.delayedCall(200, () => sword.setVisible(false));
    });

    this.input.on('keydown-SHIFT', () => {
        const now = this.time.now;
        if (now - lastArrowTime > 400) { // fire rate
            let arrow = arrows.create(player.x, player.y, 'arrow');
            arrow.setVelocityX(player.flipX ? -400 : 400);
            arrow.setGravityY(-600); // ignore gravity
            arrow.setFlipX(player.flipX);
            lastArrowTime = now;
        }
    });
}

function update() {
    // Level switch: if all enemies defeated, go to next level
    if (enemies.countActive(true) === 0) {
        if (currentLevel < 4) {
            currentLevel++;
            setupLevel(currentLevel, this);
        }
    }
// Setup platforms and enemies for each level
function setupLevel(level, scene) {
    // Remove old platforms and enemies
    if (platforms) platforms.clear(true, true);
    if (enemies) enemies.clear(true, true);

    platforms = scene.physics.add.staticGroup();
    if (level === 1) {
        platforms.create(400, 584, 'ground').setScale(2).refreshBody();
        platforms.create(600, 450, 'ground');
        platforms.create(200, 350, 'ground');
        platforms.create(400, 220, 'ground');

        enemies = scene.physics.add.group();
        enemies.create(600, 400, 'enemy');
        enemies.create(200, 300, 'enemy');
        enemies.create(400, 180, 'enemy');
    } else if (level === 2) {
        platforms.create(400, 584, 'ground').setScale(2).refreshBody();
        platforms.create(700, 500, 'ground');
        platforms.create(100, 400, 'ground');
        platforms.create(300, 300, 'ground');
        platforms.create(600, 200, 'ground');

        enemies = scene.physics.add.group();
        enemies.create(700, 480, 'enemy');
        enemies.create(100, 380, 'enemy');
        enemies.create(600, 180, 'enemy');
        enemies.create(300, 280, 'enemy');
    } else if (level === 3) {
        platforms.create(400, 584, 'ground').setScale(2).refreshBody();
        platforms.create(150, 500, 'ground');
        platforms.create(650, 400, 'ground');
        platforms.create(400, 300, 'ground');
        platforms.create(200, 200, 'ground');
        platforms.create(600, 120, 'ground');

        enemies = scene.physics.add.group();
        enemies.create(150, 480, 'enemy');
        enemies.create(650, 380, 'enemy');
        enemies.create(400, 280, 'enemy');
        enemies.create(200, 180, 'enemy');
        enemies.create(600, 100, 'enemy');
    } else if (level === 4) {
        platforms.create(400, 584, 'ground').setScale(2).refreshBody();
        platforms.create(100, 500, 'ground');
        platforms.create(700, 500, 'ground');
        platforms.create(250, 400, 'ground');
        platforms.create(550, 300, 'ground');
        platforms.create(400, 200, 'ground');
        platforms.create(100, 120, 'ground');
        platforms.create(700, 120, 'ground');

        enemies = scene.physics.add.group();
        enemies.create(100, 480, 'enemy');
        enemies.create(700, 480, 'enemy');
        enemies.create(250, 380, 'enemy');
        enemies.create(550, 280, 'enemy');
        enemies.create(400, 180, 'enemy');
        enemies.create(100, 100, 'enemy');
        enemies.create(700, 100, 'enemy');
    }

    enemies.children.iterate(function(enemy) {
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1);
        enemy.setVelocityX(enemySpeed);
    });

    scene.physics.add.collider(playerContainer, platforms);
    scene.physics.add.collider(enemies, platforms);
    scene.physics.add.collider(playerContainer, enemies, hitPlayer, null, scene);
}
    if (cursors.left.isDown) {
        playerContainer.body.setVelocityX(-160);
        playerContainer.flipX = true;
    } else if (cursors.right.isDown) {
        playerContainer.body.setVelocityX(160);
        playerContainer.flipX = false;
    } else {
        playerContainer.body.setVelocityX(0);
    }

    if (cursors.up.isDown && playerContainer.body.touching.down) {
        playerContainer.body.setVelocityY(-900);
    }


        // Sword attack (space)
        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            swordActive = true;
            swordTimer = this.time.now;
            sword.setVisible(true);
        }
        if (swordActive && this.time.now - swordTimer > 200) {
            swordActive = false;
            sword.setVisible(false);
        }

        // Bow/arrow attack (shift)
        if (Phaser.Input.Keyboard.JustDown(shiftKey)) {
            const now = this.time.now;
            if (now - lastArrowTime > 400) {
                let arrow = arrows.create(playerContainer.x, playerContainer.y, 'arrow');
                arrow.setVelocityX(playerContainer.flipX ? -400 : 400);
                arrow.setGravityY(-600);
                arrow.setFlipX(playerContainer.flipX);
                lastArrowTime = now;
            }
        }

    // Sword follows player

    // Enemies move back and forth
    enemies.children.iterate(function(enemy) {
        if (enemy.body.blocked.right) {
            enemy.setVelocityX(-enemySpeed);
            enemy.flipX = true;
        } else if (enemy.body.blocked.left) {
            enemy.setVelocityX(enemySpeed);
            enemy.flipX = false;
        }
    });

    // Sword defeats enemies
    if (swordActive) {
        enemies.children.iterate(function(enemy) {
            if (!enemy || !enemy.active) return;
            if (Phaser.Math.Distance.Between(sword.x, sword.y, enemy.x, enemy.y) < 40) {
                enemy.destroy();
            }
        });
    }

    // Arrow defeats enemies
    arrows.children.each(function(arrow) {
        enemies.children.iterate(function(enemy) {
            if (!enemy || !enemy.active) return;
            if (Phaser.Math.Distance.Between(arrow.x, arrow.y, enemy.x, enemy.y) < 24) {
                enemy.destroy();
                arrow.destroy();
            }
        });
    });
    sword.setPosition(playerContainer.x + (playerContainer.flipX ? -30 : 30), playerContainer.y);
    sword.setFlipX(playerContainer.flipX);

    // Remove arrows out of bounds
    arrows.children.each(function(arrow) {
        if (arrow.x < 0 || arrow.x > 800) {
            arrow.destroy();
        }
    }, this);
}

const game = new Phaser.Game(config);

// Player hit by enemy
function hitPlayer(player, enemy) {
    // Tint all children of playerContainer
    player.list.forEach(child => {
        if (child.setFillStyle) child.setFillStyle(0xff0000);
    });
    this.time.delayedCall(300, () => {
        player.list.forEach((child, i) => {
            // Restore original colors
            if (child.setFillStyle) {
                if (i === 0) child.setFillStyle(0x888888); // armor
                if (i === 1) child.setFillStyle(0x444444); // helmet
                if (i === 2) child.setFillStyle(0xffcc99); // face
            }
        });
    });
}
