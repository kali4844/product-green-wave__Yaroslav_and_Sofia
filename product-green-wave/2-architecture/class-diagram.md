# Діаграма класів предметної області

Прототип написано на JavaScript у функціональному стилі. Діаграма описує предметну модель: класи відповідають структурам даних і функціям прототипу (див. [modules.md](modules.md)).

```mermaid
classDiagram
    class RouteSettings {
        +float lengthM
        +float speedKmh
        +float speedMinKmh
        +float speedMaxKmh
        +float startTimeS
        +float marginS
        +float platoonS
    }
    class TrafficLight {
        +float distanceM
        +float greenS
        +float redS
        +float offsetS
        +cycleS() float
        +isGreenAt(t) bool
        +waitAt(t) float
    }
    class Simulator {
        +simulate(speedKmh) SimulationResult
    }
    class SimulationResult {
        +float totalS
        +float avgKmh
        +int stops
        +float waitSumS
        +float minMarginS
        +points() List
    }
    class LightPassage {
        +float arrivalS
        +bool green
        +float waitS
        +float marginS
    }
    class Optimizer {
        +scanSpeeds() SpeedScan
        +recommendTiming(light, speedKmh) Recommendation
        +applyTiming(speedKmh) void
    }
    class SpeedScan {
        +List okSpeeds
        +float optimalKmh
        +bool hasMargin
    }
    class Recommendation {
        +float greenS
        +float redS
        +float offsetS
        +float arrivalS
    }
    class Validator {
        +validate() List
    }
    class ChartRenderer {
        +renderChart(result) SVG
    }

    RouteSettings "1" o-- "1..*" TrafficLight : містить
    Simulator ..> RouteSettings : читає
    Simulator ..> TrafficLight : читає
    Simulator --> SimulationResult : створює
    SimulationResult "1" *-- "0..*" LightPassage : складається з
    LightPassage --> TrafficLight : для
    Optimizer ..> Simulator : викликає
    Optimizer --> SpeedScan : створює
    Optimizer --> Recommendation : створює
    Recommendation --> TrafficLight : для
    Validator ..> RouteSettings : перевіряє
    Validator ..> TrafficLight : перевіряє
    ChartRenderer ..> SimulationResult : малює
    ChartRenderer ..> TrafficLight : малює
```
