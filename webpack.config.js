module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader",
        "postcss-loader",
        "resolve-url-loader",
      ],
    },
  ];
}
