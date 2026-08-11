## ADDED Requirements

### Requirement: 添加 Todo

系统 SHALL 允许用户在输入框中输入文本并添加新的 Todo 项。

#### Scenario: 成功添加 Todo

- **WHEN** 用户在输入框中输入非空文本并触发添加操作
- **THEN** 新 Todo 项出现在列表中
- **AND** 该 Todo 项显示用户输入的文本
- **AND** 该 Todo 项初始状态为未完成
- **AND** 输入框被清空

#### Scenario: 拒绝空内容

- **WHEN** 用户输入框为空或仅含空白字符并触发添加操作
- **THEN** 系统不添加新 Todo 项
- **AND** 列表保持不变

### Requirement: 标记完成状态

系统 SHALL 允许用户切换 Todo 项的完成状态。

#### Scenario: 标记为已完成

- **WHEN** 用户点击未完成 Todo 项的完成控件
- **THEN** 该 Todo 项状态变为已完成
- **AND** UI 反映已完成状态（如 checkbox 选中、文本样式变化）

#### Scenario: 取消完成

- **WHEN** 用户点击已完成 Todo 项的完成控件
- **THEN** 该 Todo 项状态变为未完成
- **AND** UI 反映未完成状态

### Requirement: 删除 Todo

系统 SHALL 允许用户删除 Todo 项。

#### Scenario: 删除 Todo 项

- **WHEN** 用户点击某 Todo 项的删除操作
- **THEN** 该 Todo 项从列表中移除
- **AND** 其余 Todo 项保持不变

### Requirement: 空列表提示

系统 SHALL 在无 Todo 项时显示空状态提示。

#### Scenario: 初始空列表

- **WHEN** 应用加载且没有任何 Todo 项
- **THEN** 系统显示空列表提示信息
- **AND** 不显示 Todo 列表项

### Requirement: 数据持久化

系统 SHALL 使用 localStorage 持久化 Todo 数据，刷新页面后数据不丢失。

#### Scenario: 刷新后恢复数据

- **WHEN** 用户已添加一个或多个 Todo 项
- **AND** 用户刷新页面
- **THEN** 所有 Todo 项及其完成状态与刷新前一致

#### Scenario: 操作后自动保存

- **WHEN** 用户执行添加、切换完成或删除操作
- **THEN** 系统立即将当前 Todo 列表保存到 localStorage（key: `openspec-demo:todos`）
