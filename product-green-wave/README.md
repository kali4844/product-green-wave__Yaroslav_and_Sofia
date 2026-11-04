# Зелена хвиля

Веб-калькулятор, який розраховує час і середню швидкість автомобіля на маршруті зі світлофорами та підбирає оптимальну швидкість і час зеленого сигналу, щоб автомобіль проїжджав на «зелену хвилю».

- **Проблема:** фази сусідніх світлофорів не узгоджені зі швидкістю потоку, тому водії зупиняються на кожному перехресті, а час проїзду й витрата пального зростають.
- **Для кого:** інженери з організації дорожнього руху, студенти й викладачі транспортних та інформаційних спеціальностей.
- **Рішення:** сторінка без встановлення й без реєстрації. Користувач вводить маршрут і світлофори, а сайт сам рахує оптимальну швидкість, оптимальний зелений і зсув фаз та малює графік «час — відстань».
- **Прототип:** `2-architecture/prototype/green-wave.html` (працює офлайн), сайт: `посилання на Google Sites`.
- **Команда:** `ПІБ учасника A` (продукт, документація), `ПІБ учасника B` (розробка, тестування).
- **Беклог:** `посилання на GitHub Projects або таблицю` (поточний знімок у [backlog.md](1-lifecycle/backlog.md)).

## Зміст репозиторію

| Тека | Тема | Документи |
| --- | --- | --- |
| `0-product` | Ідея | [vision.md](0-product/vision.md) |
| `1-lifecycle` | ЖЦ, вимоги, Scrum | [process.md](1-lifecycle/process.md), [srs.md](1-lifecycle/srs.md), [mvp.md](1-lifecycle/mvp.md), [traceability.md](1-lifecycle/traceability.md), [sprint-plan.md](1-lifecycle/sprint-plan.md), [backlog.md](1-lifecycle/backlog.md), [changes.md](1-lifecycle/changes.md) |
| `2-architecture` | UML, архітектура, API, прототип | [use-cases.md](2-architecture/use-cases.md), [class-diagram.md](2-architecture/class-diagram.md), [architecture.md](2-architecture/architecture.md), [modules.md](2-architecture/modules.md), [api.md](2-architecture/api.md), [integration-plan.md](2-architecture/integration-plan.md), [adr/](2-architecture/adr/0001-client-side-single-file.md), [prototype/](2-architecture/prototype/README.md) |
| `3-implementation` | Дані, валідація | [data-model.md](3-implementation/data-model.md), [validation-rules.md](3-implementation/validation-rules.md) |
| `4-quality` | Тестування, ревʼю, дефекти | [test-plan.md](4-quality/test-plan.md), [test-cases.md](4-quality/test-cases.md), [test-report.md](4-quality/test-report.md), [review-report.md](4-quality/review-report.md), [bug-reports.md](4-quality/bug-reports.md) |
| `5-management` | План, ризики, реліз, супровід | [plan.md](5-management/plan.md), [risks.md](5-management/risks.md), [release-plan.md](5-management/release-plan.md), [user-guide.md](5-management/user-guide.md), [support.md](5-management/support.md) |

Історія змін: [CHANGELOG.md](CHANGELOG.md).
