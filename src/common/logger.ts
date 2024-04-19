import { pino } from "pino";

const transport = pino.transport({
  targets: [
    {
      level: "trace",
      target: "pino/file",
      options: {
        destination: 1,
      },
    },
    ...(process.env.NODE_ENV === "development"
      ? [
          {
            level: "trace",
            target: "pino/file",
            options: {
              destination: "./pino.log",
            },
          },
        ]
      : []),
  ],
});

export const logger = pino({ name: "server" }, transport);
