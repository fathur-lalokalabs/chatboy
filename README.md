## ChatBoy MVP

## HOW TO USE

1) Add script before closing of HTML body tag

```
<body>
<!-- place before closing body tag -->
<script src="https://fathur-lalokalabs.github.io/chatboy/chatboy.js"></script>
</body>
```

2) Once document ready, initialize the script. All dependencies will be automatically loaded.

```
<script>
    // once document ready, init
    chatboy.init();
</script>
```

## DEMO

https://codepen.io/Muhammad-Fathur/pen/yLQRKRV

### IFRAME source

https://fathur-lalokalabs.github.io/chatboy/

## DEVELOPMENT

1) Enable `dev_mode`, once its enable you can user local copy of chatboy.js. Refer to `test.html`

```
<script src="chatboy.js"></script>

<script>
    chatboy.init({ dev_mode: true });
</script>
```



