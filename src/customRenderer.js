import * as Blockly from 'blockly';

/**
 * Custom constant provider that uses triangular notches instead of puzzle pieces
 */
export class TriangularConstantProvider extends Blockly.geras.ConstantProvider {
  constructor() {
    super();
    // Increase padding by approximately 0.5rem (8px)
    this.BLOCK_PADDING = 16;  // Default is typically 8
    this.FIELD_HORIZONTAL_MARGIN = 13;  // Default is typically 5
    this.FIELD_VERTICAL_MARGIN = 13;  // Default is typically 5
  }

  /**
   * Create a triangular notch shape for previous/next connections
   */
  makeNotch() {
    const width = this.NOTCH_WIDTH;
    const height = this.NOTCH_HEIGHT;
    return {
      type: this.SHAPES.NOTCH,
      width,
      height,
      pathUp: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
      pathDown: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, -height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
    };
  }

  /**
   * Create a triangular tab shape for input/output connections
   */
  makePuzzleTab() {
    const width = this.TAB_WIDTH;
    const height = this.TAB_HEIGHT;
    return {
      type: this.SHAPES.PUZZLE,
      width,
      height,
      pathUp: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
      pathDown: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, -height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
    };
  }

  /**
   * Create a triangular shape for variable/round connections
   */
  makeRoundTab() {
    const width = this.NOTCH_WIDTH;
    const height = this.NOTCH_HEIGHT;
    return {
      type: this.SHAPES.PUZZLE,
      width,
      height,
      pathUp: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
      pathDown: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, -height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
    };
  }

  /**
   * Create a triangular shape for inline/insert connections
   */
  makeInlineTab() {
    const width = this.NOTCH_WIDTH;
    const height = this.NOTCH_HEIGHT;
    return {
      type: this.SHAPES.PUZZLE,
      width,
      height,
      pathUp: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
      pathDown: Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(0, 0),
        Blockly.utils.svgPaths.point(width / 2, -height),
        Blockly.utils.svgPaths.point(width, 0)
      ]),
    };
  }
}

/**
 * Custom renderer that uses the triangular constant provider
 */
export class TriangularRenderer extends Blockly.geras.Renderer {
  constructor() {
    super();
  }

  /**
   * Create the constant provider for this renderer
   */
  createConstantProvider_() {
    return new TriangularConstantProvider();
  }
}

/**
 * Register the custom renderer
 */
export const registerTriangularRenderer = () => {
  Blockly.blockRendering.register('triangular', TriangularRenderer);
};
