# Таблиця трасування

Вимога → варіант використання → компонент → тест-кейси. Компоненти описані в [modules.md](../2-architecture/modules.md), варіанти використання в [use-cases.md](../2-architecture/use-cases.md), кейси в [test-cases.md](../4-quality/test-cases.md).

| Вимога | Пріоритет | Use case | Компонент | Тест-кейси |
| --- | --- | --- | --- | --- |
| FR-01 | Must | UC-01 | M1, M2 | TC-09, TC-10, TC-22 |
| FR-02 | Must | UC-04 | M1, M2 | TC-29, TC-30, TC-35, TC-36, TC-37 |
| FR-03 | Must | UC-01 | M1, M2 | TC-07, TC-23, TC-24, TC-25, TC-26, TC-27, TC-31 |
| FR-04 | Must | UC-01 | M3 | TC-01, TC-02, TC-08, TC-12 |
| FR-05 | Must | UC-01 | M3, M5 | TC-01, TC-02, TC-03, TC-04, TC-05, TC-06, TC-11 |
| FR-06 | Must | UC-01 | M3 | TC-02, TC-08 |
| FR-07 | Must | UC-02 | M4 | TC-13, TC-15, TC-17 |
| FR-08 | Must | UC-02 | M4 | TC-13, TC-14, TC-15, TC-16, TC-34 |
| FR-09 | Must | UC-03 | M4 | TC-18, TC-19, TC-20, TC-32 |
| FR-10 | Should | UC-03 | M1, M4 | TC-32 |
| FR-11 | Should | UC-03 | M1, M4 | TC-33 |
| FR-12 | Must | UC-05 | M5 | TC-39, TC-42 |
| FR-13 | Must | UC-01 | M2 | TC-21, TC-22, TC-23, TC-24, TC-25, TC-26, TC-27, TC-28, TC-29, TC-30, TC-31, TC-38 |
| FR-14 | Should | UC-03 | M1, M4 | TC-14, TC-16, TC-18, TC-28 |
| FR-15 | Could | UC-01 | M1 | не покрито (Could, ручна перевірка в `usability-test`) |
| FR-16 | Should | UC-01 | M1, M5 | TC-37 |
| NFR-01 | Should | UC-01 | M3, M4, M5 | вимір у [test-report.md](../4-quality/test-report.md) |
| NFR-03 | Should | UC-01 | M1 | TC-40 |
| NFR-04 | Should | UC-01 | усі | TC-43 і вимір розміру у звіті |
| NFR-05 | Must | UC-01 | M3 | TC-01, TC-02, TC-08 |
| NFR-06 | Must | UC-01 | усі | TC-43 |
| NFR-07 | Should | UC-01 | M1, M5 | TC-41 |

Кожна Must-вимога має щонайменше один тест-кейс.
