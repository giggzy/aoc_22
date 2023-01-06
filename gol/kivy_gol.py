from kivy.app import App
from kivy.config import Config

Config.set("graphics", "width", 903)
Config.set("graphics", "height", 933)

from kivy.clock import Clock
from kivy.properties import (
    NumericProperty,
    ObjectProperty,
    ReferenceListProperty,
    StringProperty,
)
from kivy.uix.button import Button
from kivy.uix.gridlayout import GridLayout
from kivy.uix.togglebutton import ToggleButton
from kivy.uix.widget import Widget
from kivy.vector import Vector

"""
class PongPaddle(Widget):
    score = NumericProperty(0)

    def bounce_ball(self, ball):
        if self.collide_widget(ball):
            vx, vy = ball.velocity
            offset = (ball.center_y - self.center_y) / (self.height / 2)
            bounced = Vector(-1 * vx, vy)
            vel = bounced * 1.1
            ball.velocity = vel.x, vel.y + offset


class PongBall(Widget):
    velocity_x = NumericProperty(0)
    velocity_y = NumericProperty(0)
    velocity = ReferenceListProperty(velocity_x, velocity_y)

    def move(self):
        self.pos = Vector(*self.velocity) + self.pos


class PongGame(Widget):
    ball = ObjectProperty(None)
    player1 = ObjectProperty(None)
    player2 = ObjectProperty(None)

    def serve_ball(self, vel=(4, 0)):
        self.ball.center = self.center
        self.ball.velocity = vel

    def update(self, dt):
        self.ball.move()

        # bounce of paddles
        self.player1.bounce_ball(self.ball)
        self.player2.bounce_ball(self.ball)

        # bounce ball off bottom or top
        if (self.ball.y < self.y) or (self.ball.top > self.top):
            self.ball.velocity_y *= -1

        # went of to a side to score point?
        if self.ball.x < self.x:
            self.player2.score += 1
            self.serve_ball(vel=(4, 0))
        if self.ball.right > self.width:
            self.player1.score += 1
            self.serve_ball(vel=(-4, 0))

    def on_touch_move(self, touch):
        if touch.x < self.width / 3:
            self.player1.center_y = touch.y
        if touch.x > self.width - self.width / 3:
            self.player2.center_y = touch.y


class PongApp(App):
    def build(self):
        game = PongGame()
        game.serve_ball()
        Clock.schedule_interval(game.update, 1.0 / 60.0)
        return game


if __name__ == "__main__":
    PongApp().run()
"""


class GOLGame(GridLayout):
    active = False  # Defines whether the game is running, or paused.
    start_pause = StringProperty("Start")
    clear_stop = StringProperty("Clear")
    clock = None

    def update(self, dt):
        pass

    def start(self):
        print(f"Starting {self}...")

    def stop(self):
        print(f"Stopping {self}...")

    def start_pause(self):
        print(f"Starting/Pausing {self}...")

    def start_action(self):

        # If game is paused, run it, making an iteration every half a second
        # Change the labels to Pause and Stop

        if self.active is False:
            for instance in CustomButton.cells:
                instance.disabled = True
            self.clock = Clock.schedule_interval(iteration, 0.5)
            self.active = True
            self.start_pause = "Pause"
            self.clear_stop = "Stop"

        # Else, unschedule the game and change the labels to Start and Clear

        elif self.active is True:
            self.clock.cancel()
            for instance in CustomButton.cells:
                instance.disabled = False
            self.active = False
            self.start_pause = "Start"
            self.clear_stop = "Clear"

    def clear_action(self):

        # Stop the game if running, and change all instances to their normal
        # state and set them to False, so that they are not considered as
        # living cells in the next game.

        if self.active is False:
            for instance in CustomButton.cells:
                instance.state = "normal"
                instance.phase = False
        elif self.active is True:
            self.start_action()
            for instance in CustomButton.cells:
                instance.state = "normal"
                instance.phase = False


def change_phase(instance):
    instance.phase = instance.phase is not True


def iteration(dt):

    # Get the list of cells.
    # Create temporary list

    cells = CustomButton.cells
    next_iteration = []

    # For each cell, count its living neighbours by trying to access them and
    # checking their phase

    for i, instance in enumerate(cells):

        neighbours = [-51, -50, -49, -1, 1, 49, 50, 51]
        living_neighbours = 0

        for x in neighbours:
            try:
                if cells[i + x].phase is True:
                    living_neighbours += 1
            except IndexError:
                pass
            if living_neighbours == 4:
                break

        # Apply the game's rules
        #  1: Any live cell with fewer than two live neighbours dies,
        #     as if caused by underpopulation.
        #  2: Any live cell with two or three live neighbours lives on to
        #     the next generation.
        #  3: Any live cell with more than three live neighbours dies,
        #     as if by overpopulation.
        #  4: Any dead cell with exactly three live neighbours becomes a
        #     live cell, as if by reproduction.

        if instance.phase is True:
            if living_neighbours < 2:
                next_iteration.append(False)
            elif living_neighbours > 3:
                next_iteration.append(False)
            else:
                next_iteration.append(True)
        else:
            if living_neighbours == 3:
                next_iteration.append(True)
            else:
                next_iteration.append(False)

    # Change the state of the buttons according to their phases

    for i, instance in enumerate(cells):
        instance.phase = next_iteration[i]
        if next_iteration[i] is True:
            instance.state = "down"
        else:
            instance.state = "normal"


class CustomButton(ToggleButton):
    cells = []
    id = None

    def __init__(self, index, **kwargs):
        super(CustomButton, self).__init__(**kwargs)
        self.id = str(index)
        self.phase = False
        CustomButton.cells.append(self)

    def __str__(self):
        return f"Index: {self.id}"

    def __int__(self):
        return int(self.id)


class GOLApp(App):
    """
    def build(self):
        game = GOLGame()
        Clock.schedule_interval(game.update, 1.0 / 60.0)
        return game
    """

    def build(self):
        layout_base = GridLayout(cols=1, row_force_default=True, row_default_height=30)
        layout_base.add_widget(GOLGame())

        layout = GridLayout(cols=50, spacing=3, padding=3)
        for i in range(2500):
            button = CustomButton(i, size_hint=[None, None], width=15, height=15)
            button.bind(on_press=change_phase)
            layout.add_widget(button)

        layout_base.add_widget(layout)

        return layout_base


if __name__ == "__main__":
    GOLApp().run()
