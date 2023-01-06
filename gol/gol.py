# create a game of life visualization

# get the pygame library
import itertools
import random

import pygame

# configure the pygame window
pygame.init()
width = 800
height = 800
window_size = (width, height)
# font = pygame.font.SysFont("Arial", 40)
font = pygame.font.Font(pygame.font.get_default_font(), 11)
screen = pygame.display.set_mode((width, height))


objects = []


class NextButton:
    def __init__(
        self,
        x,
        y,
        width,
        height,
        buttonText="Next Generation",
        onclickFunction=None,
        onePress=False,
    ):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.onclickFunction = onclickFunction
        self.onePress = onePress
        self.alreadyPressed = False

        self.fillColors = {
            "normal": "#ffffff",
            "hover": "#666666",
            "pressed": "#333333",
        }

        self.buttonSurface = pygame.Surface((self.width, self.height))
        self.buttonRect = pygame.Rect(self.x, self.y, self.width, self.height)

        self.buttonSurf = font.render(buttonText, True, (20, 20, 20))

        self.alreadyPressed = False

        objects.append(self)

    def process(self):

        mousePos = pygame.mouse.get_pos()

        self.buttonSurface.fill(self.fillColors["normal"])
        if self.buttonRect.collidepoint(mousePos):
            self.buttonSurface.fill(self.fillColors["hover"])

            if pygame.mouse.get_pressed(num_buttons=3)[0]:
                self.buttonSurface.fill(self.fillColors["pressed"])

                if self.onePress:
                    self.onclickFunction()

                elif not self.alreadyPressed:
                    self.onclickFunction()
                    self.alreadyPressed = True

            else:
                self.alreadyPressed = False

        self.buttonSurface.blit(
            self.buttonSurf,
            [
                self.buttonRect.width / 2 - self.buttonSurf.get_rect().width / 2,
                self.buttonRect.height / 2 - self.buttonSurf.get_rect().height / 2,
            ],
        )
        screen.blit(self.buttonSurface, self.buttonRect)


def myFunction():
    print("Button Pressed")


# create a class for the game of life
class GameOfLife:
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    keep_running = True
    clock = None
    clock = pygame.time.Clock

    # initialize a 2d array of 10 x 10
    grid = []
    w = 10  # width of the grid
    h = 10  # height of the grid
    cell_size = window_size[0] // w

    def __init__(self) -> None:

        customButton = NextButton(30, 30, 400, 100, "Button One (onePress)", myFunction)

        self.grid = [[0 for _ in range(self.w)] for _ in range(self.h)]

        self.screen = pygame.display.set_mode((width, height))
        self.screen.fill(self.WHITE)
        pygame.display.set_caption("Game of Life")
        self.clock = pygame.time.Clock()

        # draw a grid on the screen

        for x, y in itertools.product(range(self.w), range(self.h)):
            top_left = ((x * self.cell_size), (y * self.cell_size))
            bottom_right = (
                (x * self.cell_size) + self.cell_size,
                (y * self.cell_size) + self.cell_size,
            )
            self.grid[x][y] = 0
            # choose one of two colors for each cell
            color = self.BLACK
            if (x + y) % 2 == 0:
                self.grid[x][y] = 1
                color = self.WHITE

            pygame.draw.rect(self.screen, color, (top_left, bottom_right))

        # create a 2d array of cells
        pygame.display.flip()

    def start(self):
        # sourcery skip: merge-nested-ifs, remove-unnecessary-cast, simplify-constant-sum, sum-comprehension

        # direction vectors
        # -1,-1   0,-1    1,-1
        # -1,0    0,0    1,0
        # -1,1   0,-1    1,1
        #
        dirs = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]

        while self.keep_running:
            self.clock.tick(1)  # 1 fps
            # Handle quit
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.keep_running = False

            for object in objects:
                object.process()

            # Game logic
            # visit all cells and update their state
            for x, y in itertools.product(range(self.w), range(self.h)):

                # check the state of the neighbors
                alive_neighbors = 0
                for dx, dy in dirs:
                    # check if the neighbor is in the grid
                    if 0 <= x + dx < self.w and 0 <= y + dy < self.h:
                        if self.grid[x + dx][y + dy] == 1:
                            alive_neighbors += 1

                if self.grid[x][y] == 1:
                    if alive_neighbors not in (2, 3):
                        self.grid[x][y] = 0  # die if not 2 or 3 neighbors alive
                elif alive_neighbors == 3:
                    self.grid[x][y] = 1

            for x, y in itertools.product(range(self.w), range(self.h)):
                top_left = ((x * self.cell_size), (y * self.cell_size))
                bottom_right = (
                    (x * self.cell_size) + self.cell_size,
                    (y * self.cell_size) + self.cell_size,
                )
                mid_point = (
                    (x * self.cell_size) + self.cell_size // 2,
                    (y * self.cell_size) + self.cell_size // 2,
                )

                next_color = self.WHITE
                if self.grid[x][y] == 1:
                    next_color = self.BLACK

                pygame.draw.rect(self.screen, next_color, (top_left, bottom_right))
                text = font.render(f"{x},{y}", True, self.BLACK)
                self.screen.blit(text, mid_point)

            # Draw
            pygame.display.flip()


def main():
    gol = GameOfLife()
    gol.start()


if __name__ == "__main__":
    main()
