# @nelts/cli

`nelts`命令行工具

## Usage

在项目中安装工具

```bash
npm i @nelts/cli
```

## Server commanders

```bash
Usage: nelts-server [options] [command]

Options:
  -v, --version    output the version number
  -h, --help       output usage information

Commands:
  dev [options]
  start [options]
  restart
  stop
```

### dev

```bash
Usage: dev [options]

Options:
  -b, --base <base>      project base dir<like package.json dirname> (default: ".")
  -m, --max <max>        how many process would you like to bootstrap (default: 0)
  -c, --config <config>  where is the config file which named nelts.config.<ts|js> (default: "nelts.config")
  -p, --port <port>      which port do server run at? (default: 8080)
  -h, --help             output usage information
```

### start

```bash
Usage: start [options]

Options:
  -b, --base <base>      project base dir<like package.json dirname> (default: ".")
  -m, --max <max>        how many process would you like to bootstrap (default: 0)
  -c, --config <config>  where is the config file which named nelts.config.<ts|js> (default: "nelts.config")
  -p, --port <port>      which port do server run at? (default: 8080)
  -h, --help             output usage information
```

### restart

```bash
Usage: restart [options]

Options:
  -h, --help  output usage information
```

### stop

```bash
Usage: stop [options]

Options:
  -h, --help  output usage information
```

## Client commanders

```bash
Usage: nelts [options] [command]

Options:
  -v, --version   output the version number
  -h, --help      output usage information

Commands:
  init [project]
```

### init

```bash
Usage: init [options] [project]

Options:
  -h, --help  output usage information
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, yunjie (Evio) shen