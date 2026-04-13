"""MkDocs macros."""

from html import escape


def define_env(env):
    @env.macro
    def diff(removed, added):
        return f'<s class="diff-removed">{removed}</s> <span class="diff-added">{added}</span>'
