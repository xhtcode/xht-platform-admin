data	表数据
array
[]
height	table 的高度。 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。
string
/
number
—
max-height	table 的最大高度。 合法的值为数字或者单位为 px 的高度。
string
/
number
—
stripe	是否为斑马纹 table
boolean
false
border	是否带有纵向边框
boolean
false
size	Table 的尺寸
enum
—
fit	列的宽度是否自撑开
boolean
true
show-header	是否显示表头
boolean
true
highlight-current-row	是否要高亮当前行
boolean
false
current-row-key	当前行的 key，只写属性
string
/
number
—
row-class-name	行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
Function
/
string
—
row-style	行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
Function
/
object
—
cell-class-name	单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
Function
/
string
—
cell-style	单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
Function
/
object
—
header-row-class-name	表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
Function
/
string
—
header-row-style	表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
Function
/
object
—
header-cell-class-name	表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
Function
/
string
—
header-cell-style	表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
Function
/
object
—
row-key	行数据的 Key，用来优化 Table 的渲染； 在使用reserve-selection功能与显示树形数据时，该属性是必填的。 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
function
/
string
—
empty-text	空数据时显示的文本内容， 也可以通过 #empty 设置
string
No Data
default-expand-all	是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
boolean
false
expand-row-keys	可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
object
—
default-sort	默认的排序列的 prop 和顺序。 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
object
如果设置了prop，但没有设置 order，那么 order将被默认设置为ascending
tooltip-effect	溢出的 tooltip 的 effect
enum
dark
tooltip-options 2.2.28	溢出 tooltip 的选项，参见下述 tooltip 组件
object
object
append-filter-panel-to 2.8.4	挂载到哪个 DOM 元素
string
—
show-summary	是否在表尾显示合计行
boolean
false
sum-text	显示摘要行第一列的文本
string
Sum
summary-method	自定义的合计计算方法
Function
—
span-method	合并行或列的计算方法
Function
—
select-on-indeterminate	在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 true，则选中所有行；若为 false，则取消选择所有行
boolean
true
indent	展示树形数据时，树节点的缩进
number
16
lazy	是否懒加载子节点数据
boolean
false
load	加载子节点数据的函数，lazy 为 true 时生效
Function
—
tree-props	渲染嵌套数据的配置选项
object
object
table-layout	设置表格单元、行和列的布局方式
enum
fixed
scrollbar-always-on	总是显示滚动条
boolean
false
show-overflow-tooltip	是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它们。这将影响全部列的展示，详请参考tooltip-options
boolean
/
object
2.3.7	—
flexible 2.2.1	确保主轴的最小尺寸，以便不超过内容
boolean
false
scrollbar-tabindex 2.8.3	body 的滚动条的包裹容器 tabindex
string
/
number
—
allow-drag-last-column 2.9.2	是否允许拖动最后一列
boolean
true
tooltip-formatter 2.9.4	自定义 show-overflow-tooltip 时的 tooltip 内容
Function
—
preserve-expanded-content 2.9.7	在折叠后是否在DOM中保留展开行内容
boolean
false
native-scrollbar 2.10.5	是否使用原生滚动条样式
boolean
false
