export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  mqtt: {
    host: process.env.MQTT_HOST ?? 'localhost',
    port: parseInt(process.env.MQTT_PORT ?? '1883', 10),
    username: process.env.MQTT_USERNAME ?? '',
    password: process.env.MQTT_PASSWORD ?? '',
    clientId: process.env.MQTT_CLIENT_ID ?? 'nest-scada',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'scada',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
});
