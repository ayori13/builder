# Модели данных

## Пользователь (User)
| Поле      | Тип     | Описание |
|-----------|----------|----------|
| id        | number   | Уникальный ID |
| email     | string   | Почта пользователя |
| password  | string   | Хэшированный пароль |
| role      | enum     | engineer / manager / customer |

---

## Дефект (Order)
| Поле        | Тип      | Описание |
|-------------|----------|----------|
| id          | number   | ID дефекта |
| title       | string   | Название |
| description | string   | Описание |
| priority    | enum     | low / medium / high |
| status      | enum     | new / in_progress / checking / done |
| assigned_to | number   | id инженера |
