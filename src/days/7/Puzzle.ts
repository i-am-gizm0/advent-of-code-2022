import Puzzle from '../../types/AbstractPuzzle';

abstract class FSEntity {
  private _name: string;
  private _parent: Directory;

  public constructor(name: string, parent: Directory) {
    this._name = name;
    this._parent = parent;
  }

  public get name(): string {
    return this._name;
  }

  public get parent(): Directory {
    return this._parent;
  }

  public abstract getSize(): number;

  public abstract print(): void;
}

class File extends FSEntity {
  private size: number;
  public constructor(name: string, parent: Directory, size: number) {
    super(name, parent);
    this.size = size;
  }

  public getSize(): number {
      return this.size;
  }

  public print() {
    console.log(`${this.name} (${this.size})`);
  }
}

class Directory extends FSEntity {
  public static allInstances: Directory[] = [];
  private children: FSEntity[] = [];

  public constructor(name: string, parent: Directory) {
    super(name, parent);
    Directory.allInstances.push(this);
  }

  public addChild(child: FSEntity) {
    this.children.push(child);
  }

  public getChildDir(name: string): Directory | undefined {
    return this.children.filter(Directory.is).find(dir => dir.name == name);
  }

  public getSize(): number {
      return this.children.map(child => child.getSize()).reduce((a,b)=>a+b);
  }

  public getPath(): string {
    if (this.name == '/') {
      return this.name;
    } else {
      const parentPath = this.parent.getPath();
      if (parentPath == '/') {
        return `/${this.name}`;
      } else {
        return `${parentPath}/${this.name}`;
      }
    }
  }

  public print(): void {
      console.group(`${this.name} (${this.children.length}, ${this.getSize()})`);
      for (const child of this.children) {
        child.print();
      }
      console.groupEnd();
  }

  public static is(entity: FSEntity): entity is Directory {
    return entity instanceof Directory;
  }
}

function parseInput(input: string): Directory {
  const commands = input.split('$ ').slice(1)
    .map(commandAndResult =>{
      const [command, ...result] = commandAndResult.split('\n');
      return { command, result: result.filter(str => str !== '') };
    });

  const tree = new Directory('/', null);
  let workingDir: Directory;

  
  for (const {command, result } of commands) {
    // console.log({command, result});
    switch (command.slice(0, 2)) {
      case 'cd': {
        const dir = command.slice(3);
        switch (dir) {
          case '/':
            workingDir = tree;
            break;
          
          case '..':
            workingDir = workingDir.parent;
            break;
          
          default:
            workingDir = workingDir.getChildDir(dir);
        }
        // console.log(`cd ${dir}: workingDir = ${workingDir.getPath()}`);
        break;
      }

      case 'ls': {
        for (const childStr of result) {
          if (childStr.slice(0, 3) == 'dir') {
            workingDir.addChild(new Directory(childStr.slice(4), workingDir));
          } else {
            const [_, sizeStr, name] = childStr.match(/(\d+) (.+)/);
            workingDir.addChild(new File(name, workingDir, parseInt(sizeStr)));
          }
        }
        break;
      }
    }
  }

  return tree;
}

let tree: Directory;

export default class ConcretePuzzle extends Puzzle {

  public solveFirst(): string {
    tree = parseInput(this.input);
    // tree.print();

    return Directory.allInstances.filter(dir => dir.getSize() <= 100_000).map(dir => dir.getSize()).reduce((a,b)=>a+b).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '95437';
  }

  public solveSecond(): string {
    if (!tree) {
      tree = parseInput(this.input);
    }

    const TOTAL_SPACE = 70_000_000;
    const MIN_FREE = 30_000_000;
    const INITIAL_FREE = TOTAL_SPACE - tree.getSize();

    const candidates = Directory.allInstances.filter(dir => dir.getSize() >= MIN_FREE - INITIAL_FREE).sort((a,b)=>a.getSize() - b.getSize());
    // console.log(candidates.map(candidates => [
    //   candidates.getPath(),
    //   candidates.getSize()
    // ]));

    // WRITE SOLUTION FOR TEST 2
    return candidates[0].getSize().toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '24933642';
  }
}
