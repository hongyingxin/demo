# app-routing Specification

## Purpose

应用路由、Home/Todo 页面访问与顶部导航行为。

## Requirements

### Requirement: Home 页访问

系统 SHALL 在用户访问 `/` 时显示 Home 页。

#### Scenario: 访问 Home 页

- **WHEN** 用户访问 `/`
- **THEN** 系统显示 Home 页内容
- **AND** 不显示 Todo 列表

### Requirement: Todo 页路由

系统 SHALL 在用户访问 `/todos` 时显示 Todo 应用。

#### Scenario: 访问 Todo 页

- **WHEN** 用户访问 `/todos`
- **THEN** 系统显示 Todo 应用（表单与列表）
- **AND** Todo 行为符合 `todo-ui` 规范

### Requirement: 顶部导航

系统 SHALL 提供全局顶部导航，支持在 Home 与 Todo 页面间切换。

#### Scenario: 导航到 Todo

- **WHEN** 用户在任意页面点击导航中的 Todo 链接
- **THEN** 路由切换到 `/todos`
- **AND** 显示 Todo 应用

#### Scenario: 导航到 Home

- **WHEN** 用户在任意页面点击导航中的 Home 链接
- **THEN** 路由切换到 `/`
- **AND** 显示 Home 页

#### Scenario: 当前页高亮

- **WHEN** 用户位于 `/todos`
- **THEN** 导航中 Todo 链接呈现当前激活状态
