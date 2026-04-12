<section class="content-section">
    <div class="content-header-card">
        <a class="curso-back-link" href="/cursos">← Voltar</a>
        <h1><?= htmlspecialchars($courseName) ?></h1>
        <p>Caminho: <code><?= htmlspecialchars($coursePath) ?></code></p>
    </div>

    <div class="content-card">
        <?php
        $renderTree = function(array $items, string $coursePath) use (&$renderTree): void {
            echo '<ul class="curso-tree">';

            foreach ($items as $item) {
                if ($item['type'] === 'folder') {
                    echo '<li class="curso-tree-folder">';
                    echo '<details>';
                    echo '<summary>📁 ' . htmlspecialchars($item['name']) . '</summary>';
                    $renderTree($item['children'], $coursePath);
                    echo '</details>';
                    echo '</li>';
                    continue;
                }

                $url = '/curso/arquivo?path=' . urlencode($coursePath) . '&file=' . urlencode($item['relative_path']);

                echo '<li class="curso-tree-file">';
                echo '<a href="' . htmlspecialchars($url) . '">📄 ' . htmlspecialchars($item['name']) . '</a>';
                echo '</li>';
            }

            echo '</ul>';
        };

        $renderTree($tree, $coursePath);
        ?>
    </div>
</section>