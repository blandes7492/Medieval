// Setup platforms and enemies for each level
function setupLevel(level, scene) {
	// Remove old platforms and enemies
	if (platforms) platforms.clear(true, true);
	if (enemies) enemies.clear(true, true);

	platforms = scene.physics.add.staticGroup();
	if (level === 1) {
		platforms.create(400, 584, 'platform_stone').setScale(2).refreshBody();
		platforms.create(600, 450, 'platform_stone');
		platforms.create(200, 350, 'platform_stone');
		platforms.create(400, 220, 'platform_stone');

		enemies = scene.physics.add.group();
		enemies.create(600, 400, 'orc_tex');
		enemies.create(200, 300, 'orc_tex');
		enemies.create(400, 180, 'orc_tex');
	} else if (level === 2) {
		// Use stone platforms for level 2 as requested
		platforms.create(400, 584, 'platform_stone').setScale(2).refreshBody();
		platforms.create(700, 500, 'platform_stone');
		platforms.create(100, 400, 'platform_stone');
		platforms.create(300, 300, 'platform_stone');
		platforms.create(600, 200, 'platform_stone');

		enemies = scene.physics.add.group();
		enemies.create(700, 480, 'orc_tex');
		enemies.create(100, 380, 'orc_tex');
		enemies.create(600, 180, 'orc_tex');
		enemies.create(300, 280, 'orc_tex');
	} else if (level === 3) {
		platforms.create(400, 584, 'platform_stone').setScale(2).refreshBody();
		platforms.create(150, 500, 'platform_stone');
		platforms.create(650, 400, 'platform_stone');
		platforms.create(400, 300, 'platform_stone');
		platforms.create(200, 200, 'platform_stone');
		platforms.create(600, 120, 'platform_stone');

		enemies = scene.physics.add.group();
		enemies.create(150, 480, 'orc_tex');
		enemies.create(650, 380, 'orc_tex');
		enemies.create(400, 280, 'orc_tex');
		enemies.create(200, 180, 'orc_tex');
		enemies.create(600, 100, 'orc_tex');
	} else if (level === 4) {
		platforms.create(400, 584, 'platform_stone').setScale(2).refreshBody();
		platforms.create(100, 500, 'platform_stone');
		platforms.create(700, 500, 'platform_stone');
		platforms.create(250, 400, 'platform_stone');
		platforms.create(550, 300, 'platform_stone');
		platforms.create(400, 200, 'platform_stone');
		platforms.create(100, 120, 'platform_stone');
		platforms.create(700, 120, 'platform_stone');

		enemies = scene.physics.add.group();
		enemies.create(100, 480, 'orc_tex');
		enemies.create(700, 480, 'orc_tex');
		enemies.create(250, 380, 'orc_tex');
		enemies.create(550, 280, 'orc_tex');
		enemies.create(400, 180, 'orc_tex');
		enemies.create(100, 100, 'orc_tex');
		enemies.create(700, 100, 'orc_tex');
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
    // Minimal placeholders still used elsewhere; enemy replaced by procedural orc
    this.load.image('ground', 'https://dummyimage.com/400x32/444/222&text=Platform');
    this.load.image('player', 'https://dummyimage.com/32x48/8b5c2b/fff&text=Knight');
    this.load.image('sword', 'https://dummyimage.com/40x10/fff/8b5c2b&text=Sword');
    this.load.image('arrow', 'https://dummyimage.com/32x8/fff/222&text=Arrow');
}

function generateWeaponTextures(scene) {
    // Sword texture (default pointing right)
    if (!scene.textures.exists('sword_tex')) {
        const swordWidth = 64;
        const swordHeight = 20;
        const g = scene.add.graphics();
        g.clear();
        // Blade
        g.fillStyle(0xdfe6eb, 1);
        g.fillRect(18, 7, 40, 6);
        g.fillStyle(0xc0c9cf, 1);
        g.fillRect(18, 9, 40, 2);
        // Tip
        g.fillStyle(0xdfe6eb, 1);
        g.fillPoints([{x:58,y:7},{x:63,y:10},{x:58,y:13}], true);
        // Crossguard
        g.fillStyle(0x8b6f47, 1);
        g.fillRect(14, 5, 6, 10);
        g.fillRect(6, 8, 22, 4);
        // Grip
        g.fillStyle(0x4a3a26, 1);
        g.fillRect(4, 7, 10, 6);
        // Pommel
        g.fillStyle(0x6b5840, 1);
        g.fillCircle(4, 10, 3);
        g.generateTexture('sword_tex', swordWidth, swordHeight);
        g.destroy();
    }

    // Arrow texture (default pointing right)
    if (!scene.textures.exists('arrow_tex')) {
        const arrowWidth = 36;
        const arrowHeight = 12;
        const g2 = scene.add.graphics();
        g2.clear();
        // Shaft
        g2.fillStyle(0x8b5a2b, 1);
        g2.fillRect(4, 5, 24, 2);
        // Head
        g2.fillStyle(0xb0b7bd, 1);
        g2.fillPoints([{x:28,y:4},{x:35,y:6},{x:28,y:8}], true);
        // Fletching
        g2.fillStyle(0xdedede, 1);
        g2.fillPoints([{x:6,y:4},{x:2,y:6},{x:6,y:8}], true);
        g2.fillPoints([{x:10,y:4},{x:6,y:6},{x:10,y:8}], true);
        g2.generateTexture('arrow_tex', arrowWidth, arrowHeight);
        g2.destroy();
    }
}

function generateOrcTexture(scene) {
	if (scene.textures.exists('orc_tex')) return;
	const width = 32;
	const height = 48;
	const g = scene.add.graphics();
	g.clear();
	// Body
	g.fillStyle(0x2e7d32, 1); // orc green
	g.fillRect(6, 12, 20, 28);
	// Head
	g.fillStyle(0x33691e, 1);
	g.fillRect(8, 0, 16, 14);
	// Eyes
	g.fillStyle(0xffffff, 1);
	g.fillRect(10, 5, 3, 3);
	g.fillRect(19, 5, 3, 3);
	g.fillStyle(0x000000, 1);
	g.fillRect(11, 6, 1, 1);
	g.fillRect(20, 6, 1, 1);
	// Tusks
	g.fillStyle(0xfff2cc, 1);
	g.fillRect(12, 11, 2, 3);
	g.fillRect(18, 11, 2, 3);
	// Belt
	g.fillStyle(0x5d4037, 1);
	g.fillRect(6, 28, 20, 4);
	// Boots
	g.fillStyle(0x3e2723, 1);
	g.fillRect(6, 40, 8, 6);
	g.fillRect(18, 40, 8, 6);
	// Shoulder pads
	g.fillStyle(0x8d6e63, 1);
	g.fillRect(2, 12, 10, 6);
	g.fillRect(20, 12, 10, 6);
	// Weapon hint (club) on back
	g.fillStyle(0x795548, 1);
	g.fillRect(20, 20, 8, 3);
	g.fillRect(26, 18, 2, 7);
	// Border shading
	g.lineStyle(1, 0x1b5e20, 1);
	g.strokeRect(6, 12, 20, 28);
	g.strokeRect(8, 0, 16, 14);
	// Generate
	g.generateTexture('orc_tex', width, height);
	g.destroy();
}

function generateStonePlatformTexture(scene) {
    if (scene.textures.exists('platform_stone')) return;
    const width = 400;
    const height = 32;
    const g = scene.add.graphics();
    g.fillStyle(0x9e9ea0, 1);
    g.fillRect(0, 0, width, height);
    g.generateTexture('platform_stone', width, height);
    g.destroy();
}

function create() {
    // Draw background: blue sky, clouds, and a small distant castle
    const sky = this.add.graphics();
    sky.setDepth(-20);
    sky.fillStyle(0x87ceeb, 1);
    sky.fillRect(0, 0, 800, 600);

    const clouds = this.add.graphics();
    clouds.setDepth(-19);
    clouds.fillStyle(0xffffff, 1);

    const drawCloud = (g, x, y, s) => {
        g.fillCircle(x, y, 22 * s);
        g.fillCircle(x + 24 * s, y - 10 * s, 28 * s);
        g.fillCircle(x + 52 * s, y, 22 * s);
        g.fillCircle(x + 14 * s, y + 10 * s, 18 * s);
        g.fillCircle(x + 38 * s, y + 10 * s, 18 * s);
    };

    drawCloud(clouds, 120, 100, 1.2);
    drawCloud(clouds, 360, 80, 1.0);
    drawCloud(clouds, 620, 120, 1.4);

    const castle = this.add.graphics();
    castle.setDepth(-18);
    // Distant castle silhouette
    castle.fillStyle(0xc8c8c8, 0.9);
    // Main keep
    castle.fillRect(615, 380, 90, 60);
    // Left and right towers
    castle.fillRect(595, 355, 28, 85);
    castle.fillRect(710, 355, 28, 85);
    // Battlements on keep
    [620, 638, 656, 674, 692].forEach(x => castle.fillRect(x, 370, 10, 10));
    // Battlements on towers
    [595, 610].forEach(x => castle.fillRect(x, 345, 10, 10));
    [710, 725].forEach(x => castle.fillRect(x, 345, 10, 10));
    // Door and windows
    castle.fillStyle(0x6b4f2a, 1);
    castle.fillRect(655, 410, 20, 30);
    castle.fillStyle(0x444444, 1);
    castle.fillRect(630, 395, 10, 14);
    castle.fillRect(690, 395, 10, 14);
    castle.fillRect(605, 375, 8, 12);
    castle.fillRect(720, 375, 8, 12);

    // Create procedural weapon textures
    generateWeaponTextures(this);
    // Ensure platform texture exists before creating any platforms
    generateStonePlatformTexture(this);
    // Generate orc enemy texture
    generateOrcTexture(this);

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

    cursors = this.input.keyboard.createCursorKeys();
    sword = this.add.image(playerContainer.x, playerContainer.y, 'sword_tex');
    sword.setVisible(false);
    arrows = this.physics.add.group();

        // Custom keys for sword and bow
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    setupLevel(currentLevel, this);


}

function update() {
    // Level switch: if all enemies defeated, go to next level
    if (enemies.countActive(true) === 0) {
        if (currentLevel < 4) {
            currentLevel++;
            setupLevel(currentLevel, this);
        }
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
                let arrow = arrows.create(playerContainer.x, playerContainer.y, 'arrow_tex');
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
