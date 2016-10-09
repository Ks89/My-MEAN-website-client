import { ProjectSearchPipe } from './project-search.pipe';
import { PROJECTS } from '../../services/fake-project.service.spec';

describe('TitleCasePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  let pipe = new ProjectSearchPipe();

  it('filters a null project list', () => {
    expect(pipe.transform(null, null)).toBe(null);
    // expect(pipe.transform(undefined, null)).toBe(undefined); ???
    // expect(pipe.transform([], null)).toBe([]);
  });

  it('filters a valid project list by name', () => {
    //toEqual compares objects
    expect(pipe.transform(PROJECTS, 'BYA')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'bya')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'bYA')).toEqual([PROJECTS[0]]);
  });

  it('filters a valid project list by shortDescription', () => {
    //toEqual compares objects
    expect(pipe.transform(PROJECTS, '1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, ' 1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'short description 1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'SHORT DESCRIPTION 1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'Description 1')).toEqual([PROJECTS[0]]);
  });

  // if (projects === null || projects.length === 0) {
  //   return projects;
  // } else {
  //   return projects.filter(project => {
  //     return project.name.toLowerCase().includes(args.toLowerCase()) ||
  //            project.shortDescription.toLowerCase().includes(args.toLowerCase());
  //   });
  // }
});
