import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { addComponent, addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit';
import { parseSync } from 'oxc-parser';

/**
 * This module is a corrector for the shadcn-nuxt module. Currently, it essentially applies unreleased changes on master.
 */
export interface ModuleOptions {
  prefix?: string;
  componentDir?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'shadcn',
    configKey: 'shadcn',
  },
  defaults: {
    prefix: 'Ui',
    componentDir: '@/components/ui',
  },
  async setup({ prefix, componentDir }, nuxt) {
    const COMPONENT_DIR_PATH = componentDir!;
    const ROOT_DIR_PATH = nuxt.options.rootDir;
    const { resolve, resolvePath } = createResolver(ROOT_DIR_PATH);

    const componentsPath = await resolvePath(COMPONENT_DIR_PATH);

    if (!existsSync(componentsPath)) {
      console.warn(`Component directory does not exist: ${componentsPath}`);
      return;
    }
    addComponentsDir(
      {
        path: componentsPath,
        extensions: [],
        ignore: ['**/*'],
      },
      {
        prepend: true,
      }
    );

    try {
      await Promise.all(
        readdirSync(componentsPath).map(async (dir) => {
          try {
            const filePath = await resolvePath(join(COMPONENT_DIR_PATH, dir, 'index'), { extensions: ['.ts', '.js'] });
            const content = readFileSync(filePath, { encoding: 'utf8' });
            const ast = parseSync(filePath, content, {
              sourceType: 'module',
            });

            const exportedKeys: string[] = ast.program.body
              .filter((node) => node.type === 'ExportNamedDeclaration')
              // @ts-expect-error parse return any
              .flatMap((node) => node.specifiers?.map((specifier) => specifier.exported?.name) || [])
              .filter((key: string) => /^[A-Z]/.test(key));

            exportedKeys.forEach((key) => {
              addComponent({
                name: `${prefix}${key}`,
                export: key,
                filePath: resolve(filePath),
                priority: 1,
              });
            });
          } catch (err) {
            if (err instanceof Error) console.warn('Module error: ', err.message);
          }
        })
      );
    } catch (err) {
      if (err instanceof Error) console.warn(err.message);
    }
  },
});
