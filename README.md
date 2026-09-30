# ReEdad · NutriCenter

Experiencia responsive ReEdad de NutriCenter, diseñada como una aplicación vertical para móvil y MOPI.

## Recorrido y diseño

La referencia funcional es `ReEdad · Experiencia in-store NutriCente`. La interfaz aplica las skills locales de `.agents/skills` y conserva la identidad NutriCenter con Montserrat, Roboto y el logotipo oficial. Los acentos pastel y el personaje ilustrado son recursos propios de esta experiencia.

- Atracción con edades animadas; registro con nombre, DUI formateado y consentimiento.
- Diez preguntas y una preferencia, progreso por pilar y selección accesible.
- Cuenta regresiva y resultado animado con cinco barras, perfil, superpoder y oportunidad de mejora.
- Plan de 30 días, orientación para conversar con un asesor, fecha de regreso y seguimiento semanal dentro de la plataforma.
- Perfil con ReEdad y puntos diferenciados, niveles, insignias e historial.
- Tarjeta 9:16 en tres variantes; la variante de diferencia y la de progreso no revelan la edad completa. Descarga a 1080×1920.

La interfaz escala desde teléfonos de 320 px hasta MOPI 1080×1920, respeta movimiento reducido y limpia la sesión al salir o tras dos minutos de inactividad. No incluye QR ni un acceso público a administración.

El catálogo de recompensas es informativo: no emite cupones comerciales. WhatsApp automático, wearables, referidos, ranking colectivo y métricas de tienda requieren una integración posterior. La atracción muestra «Hoy, 47 personas se quitaron años» como dato fijo de muestra para esta demo, no como una métrica real de Firebase.

## Desarrollo

```bash
npm install
npm run dev
```

El recorrido consulta directamente Firestore con `getDocFromServer` y guarda con `setDoc` en `participantProfiles/{dui}` al terminar el quiz. No inicia sesión anónima ni usa localStorage como respaldo. Los errores se muestran en la interfaz y se registran en consola; las copias locales de versiones anteriores no se migran automáticamente.

## Firebase antes de publicar

1. Comprueba los permisos de lectura y escritura de `participantProfiles` en el proyecto configurado. Que otra colección funcione no garantiza permisos para esta.
2. El archivo [firestore.rules](firestore.rules) conserva las reglas anteriores que requieren autenticación: no es compatible con el acceso directo sin sesión. No se han modificado ni desplegado las reglas del proyecto compartido desde este cambio.
3. Da el custom claim `admin: true` a las cuentas que editarán preguntas y pesos.
4. Habilita App Check con reCAPTCHA Enterprise y copia la clave pública en `.env` desde `.env.example`.
5. Prueba las reglas con Firebase Emulator Suite antes de publicar. El archivo [firebase.json](firebase.json) contiene sus puertos locales.

La API key web de Firebase identifica la aplicación. Las reglas de Firestore y App Check son las que controlan el acceso a los datos.
