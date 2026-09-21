import type { Chapter, Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "c1-l1",
    chapterId: "chapter-1",
    order: 1,
    title: "分号与括号",
    description: "熟悉语句结尾、函数调用和代码块。",
    syntaxHint: "分号结束一条语句；圆括号常用于函数调用，花括号包围代码块。",
    difficulty: 1,
    content: ";;;;;\n()()()\n{}{}{}\nprintf();",
    targetCharacters: [";", "(", ")", "{", "}"],
    mode: "course",
  },
  {
    id: "c1-l2",
    chapterId: "chapter-1",
    order: 2,
    title: "赋值与运算",
    description: "练习赋值和四则运算符。",
    syntaxHint: "等号把右侧结果赋给左侧变量。",
    difficulty: 1,
    content: "a = 10;\nb = a + 5;\nc = b - 2;\nd = c * 3;\ne = d / 2;",
    targetCharacters: ["=", "+", "-", "*", "/", ";"],
    mode: "course",
  },
  {
    id: "c1-l3",
    chapterId: "chapter-1",
    order: 3,
    title: "比较运算符",
    description: "区分大小比较、相等与不相等。",
    syntaxHint: "== 用于比较，= 用于赋值。",
    difficulty: 2,
    content: "a < b\na > b\na <= b\na >= b\na == b\na != b",
    targetCharacters: ["<", ">", "=", "!"],
    mode: "course",
  },
  {
    id: "c1-l4",
    chapterId: "chapter-1",
    order: 4,
    title: "逻辑组合",
    description: "练习与、或、非运算符。",
    syntaxHint: "&& 要求两侧都成立，|| 只要求一侧成立，! 表示取反。",
    difficulty: 2,
    content: "ready && valid\nopen || waiting\n!finished\ncount > 0 && count < 10",
    targetCharacters: ["&", "|", "!", "<", ">"],
    mode: "course",
  },
  {
    id: "c1-l5",
    chapterId: "chapter-1",
    order: 5,
    title: "数组与特殊符号",
    description: "掌握方括号、取址、取模与下划线。",
    syntaxHint: "方括号访问数组，& 可以取得变量地址，% 是取模运算符。",
    difficulty: 2,
    content: "values[0] = 8;\nresult = value % 2;\nitem_count = 5;\nprintf(\"%d\", &values[0]);",
    targetCharacters: ["[", "]", "&", "%", "_", "\""],
    mode: "course",
  },
  {
    id: "c2-l1",
    chapterId: "chapter-2",
    order: 6,
    title: "整数与字符",
    description: "从关键词过渡到简单声明。",
    syntaxHint: "int 保存整数，char 保存单个字符。",
    difficulty: 2,
    content: "int\nchar\nint age;\nchar grade;",
    targetCharacters: ["int", "char", ";"],
    mode: "course",
  },
  {
    id: "c2-l2",
    chapterId: "chapter-2",
    order: 7,
    title: "浮点类型",
    description: "练习 float 和 double 声明。",
    syntaxHint: "double 通常比 float 提供更高精度。",
    difficulty: 2,
    content: "float price;\ndouble average;\nfloat rate = 0.5;\ndouble total = 42.75;",
    targetCharacters: ["float", "double", ".", "="],
    mode: "course",
  },
  {
    id: "c2-l3",
    chapterId: "chapter-2",
    order: 8,
    title: "常量与空类型",
    description: "练习 const 与 void 的常见写法。",
    syntaxHint: "const 表示值不应被修改；void 常表示函数没有返回值。",
    difficulty: 2,
    content: "const int limit = 10;\nconst char marker = '#';\nvoid reset(void);",
    targetCharacters: ["const", "void", "'", "#"],
    mode: "course",
  },
  {
    id: "c2-l4",
    chapterId: "chapter-2",
    order: 9,
    title: "返回值",
    description: "把 return 放进短函数结构中。",
    syntaxHint: "return 结束函数，并可把一个值交给调用者。",
    difficulty: 3,
    content: "return 0;\nreturn value;\nint answer(void)\n{\n    return 42;\n}",
    targetCharacters: ["return", "(", ")", "{", "}"],
    mode: "course",
  },
  {
    id: "c2-l5",
    chapterId: "chapter-2",
    order: 10,
    title: "声明组合",
    description: "组合类型、变量名、初始值和返回语句。",
    syntaxHint: "一条声明可以同时指定类型、名称和初始值。",
    difficulty: 3,
    content: "int score = 98;\nchar level = 'A';\nconst double pi = 3.14;\nreturn score;",
    targetCharacters: ["=", "'", ".", ";"],
    mode: "course",
  },
  {
    id: "c3-l1",
    chapterId: "chapter-3",
    order: 11,
    title: "输出文字",
    description: "输入第一条完整的 printf 语句。",
    syntaxHint: "printf 把双引号中的内容输出到终端。",
    difficulty: 3,
    content: "printf(\"Hello, C!\");\nprintf(\"Keep typing.\");",
    targetCharacters: ["printf", "\"", "(", ")", ";"],
    mode: "course",
  },
  {
    id: "c3-l2",
    chapterId: "chapter-3",
    order: 12,
    title: "格式化输出",
    description: "练习格式占位符和参数。",
    syntaxHint: "%d 输出整数，%c 输出字符，%f 输出浮点数。",
    difficulty: 3,
    content: "printf(\"%d\", age);\nprintf(\"%c\", grade);\nprintf(\"%.2f\", price);",
    targetCharacters: ["%", "\"", ",", "."],
    mode: "course",
  },
  {
    id: "c3-l3",
    chapterId: "chapter-3",
    order: 13,
    title: "计算结果",
    description: "组合声明、计算与输出。",
    syntaxHint: "先保存数据，再计算结果，最后输出。",
    difficulty: 3,
    content: "int a = 10;\nint b = 20;\nint sum = a + b;\nprintf(\"%d\", sum);",
    targetCharacters: ["=", "+", "%", ","],
    mode: "course",
  },
  {
    id: "c3-l4",
    chapterId: "chapter-3",
    order: 14,
    title: "换行与转义",
    description: "练习字符串中的反斜杠和换行转义。",
    syntaxHint: "字符串中的 \\n 表示换行，\\t 表示水平制表。",
    difficulty: 3,
    content: "printf(\"Name:\\tAda\\n\");\nprintf(\"Path: C:\\\\code\\n\");",
    targetCharacters: ["\\", "\"", ":"],
    mode: "course",
  },
  {
    id: "c3-l5",
    chapterId: "chapter-3",
    order: 15,
    title: "第一个完整程序",
    description: "完成一段结构清晰的 C 程序。",
    syntaxHint: "程序从 main 函数开始执行，return 0 表示正常结束。",
    difficulty: 4,
    content: "#include <stdio.h>\n\nint main(void)\n{\n    int a = 10;\n    int b = 20;\n\n    printf(\"%d\\n\", a + b);\n\n    return 0;\n}",
    targetCharacters: ["#", "<", ">", "{", "}", "\\"],
    mode: "course",
  },
];

export const chapters: Chapter[] = [
  { id: "chapter-1", order: 1, title: "C 语言常用字符", description: "括号、运算符与特殊符号", available: true, lessonIds: lessons.filter((lesson) => lesson.chapterId === "chapter-1").map((lesson) => lesson.id) },
  { id: "chapter-2", order: 2, title: "C 语言关键词", description: "类型、常量与返回值", available: true, lessonIds: lessons.filter((lesson) => lesson.chapterId === "chapter-2").map((lesson) => lesson.id) },
  { id: "chapter-3", order: 3, title: "基础语句", description: "输出、计算与完整程序", available: true, lessonIds: lessons.filter((lesson) => lesson.chapterId === "chapter-3").map((lesson) => lesson.id) },
  { id: "chapter-4", order: 4, title: "条件判断", description: "if、else 与 switch", available: false, lessonIds: [] },
  { id: "chapter-5", order: 5, title: "循环", description: "for、while 与 do while", available: false, lessonIds: [] },
  { id: "chapter-6", order: 6, title: "函数", description: "声明、参数、返回值与调用", available: false, lessonIds: [] },
  { id: "chapter-7", order: 7, title: "数组", description: "数组声明、访问与遍历", available: false, lessonIds: [] },
];

export const practiceExercises: Lesson[] = [
  {
    id: "practice-symbols",
    chapterId: "practice",
    order: 101,
    title: "Symbols 专项",
    description: "集中练习 C 语言常用符号。",
    syntaxHint: "保持稳定节奏，注意每个符号的 Shift 组合。",
    difficulty: 2,
    content: "{} (); [] == !=\ncount++; index--;\na <= b && b >= c;",
    targetCharacters: ["{", "}", "(", ")", "[", "]", "=", "!", "+", "-"],
    mode: "symbols",
  },
  {
    id: "practice-keywords",
    chapterId: "practice",
    order: 102,
    title: "Keywords 专项",
    description: "强化关键词的连续输入。",
    syntaxHint: "先追求准确，再逐步提高速度。",
    difficulty: 2,
    content: "int char float double\nconst void return\nif else while for",
    targetCharacters: ["int", "char", "return", "while"],
    mode: "keywords",
  },
  {
    id: "practice-snippets",
    chapterId: "practice",
    order: 103,
    title: "Code Snippets",
    description: "输入短小但完整的代码片段。",
    syntaxHint: "观察结构，再保持连续输入。",
    difficulty: 3,
    content: "int max = a > b ? a : b;\nprintf(\"max = %d\\n\", max);",
    targetCharacters: ["?", ":", ">", "%", "\\"],
    mode: "snippets",
  },
  {
    id: "practice-program",
    chapterId: "practice",
    order: 104,
    title: "Full Program",
    description: "练习一段完整的 C 程序。",
    syntaxHint: "注意空行、缩进与头文件尖括号。",
    difficulty: 4,
    content: "#include <stdio.h>\n\nint main(void)\n{\n    int value = 42;\n    printf(\"%d\\n\", value);\n    return 0;\n}",
    targetCharacters: ["#", "<", ">", "{", "}", "\\"],
    mode: "program",
  },
];

export const allExercises = [...lessons, ...practiceExercises];

export function getExercise(id: string | undefined) {
  return allExercises.find((lesson) => lesson.id === id);
}

export function getNextLesson(id: string) {
  const currentIndex = lessons.findIndex((lesson) => lesson.id === id);
  return currentIndex >= 0 ? lessons[currentIndex + 1] : undefined;
}

export function buildWeakExercise(missedCharacters: Record<string, number>): Lesson {
  const ranked = Object.entries(missedCharacters)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([character]) => character);

  const relevant = lessons
    .filter((lesson) => ranked.some((character) => lesson.targetCharacters.includes(character)))
    .slice(0, 3);

  const fallback = [lessons[0], lessons[2], lessons[4]];
  const selected = relevant.length ? relevant : fallback;

  return {
    id: "practice-weak",
    chapterId: "practice",
    order: 105,
    title: "薄弱字符专项",
    description: ranked.length ? `重点强化：${ranked.join("  ")}` : "完成更多课程后，将根据错误记录自动选题。",
    syntaxHint: "练习来自人工编写的课程片段，不会随机拼接无意义代码。",
    difficulty: 3,
    content: selected.map((lesson) => lesson.content.split("\n").slice(-2).join("\n")).join("\n\n"),
    targetCharacters: ranked,
    mode: "weak",
  };
}
