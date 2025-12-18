import asyncio
from app.db import db

async def main():
    await db.connect()
    print("✅ Conectado a la DB")

    # Crear un usuario completo
    usuario = await db.usuario.create(
        data={
            "nombre": "Joan Nácher",
            "email": "joan@example.com",
            "password": "1234",
            "activo": True,
            "roles": {
                "create": [
                    {"rol": "JUGADOR"},
                    {"rol": "ENTRENADOR"}
                ]
            },
            "equipos": {
                "create": [
                    {
                        "rolEquipo": "ENTRENADOR",
                        "equipo": {
                            "create": {
                                "nombre": "Equipo A",
                                "categoria": "Senior",
                                "club": {
                                    "create": {
                                        "nombre": "Club Padel Ontinyent"
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            "notificaciones": {
                "create": [
                    {"titol": "Bienvenido", "missatge": "Usuario creado correctamente", "llegit": False}
                ]
            }
        },
        include={
            "roles": True,
            "equipos": True,
            "notificaciones": True
        }
    )

    print("Usuario completo creado:")
    print(usuario)

    await db.disconnect()
    print("✅ Desconectado de la DB")

asyncio.run(main())
